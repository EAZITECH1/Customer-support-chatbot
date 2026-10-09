// server/llm.js
// Minimal OpenAI-compatible chat client (no SDK — just fetch).
// Works with Ollama, LM Studio, OpenRouter, Groq, Together, vLLM, etc.

export class LLM {
  constructor({ baseUrl, apiKey, model, temperature = 0.1 }) {
    // Don't throw here — let the server boot and serve the UI / MemWal even
    // before the model is configured. We validate on first use in complete().
    this.baseUrl = (baseUrl || '').replace(/\/+$/, '');
    this.apiKey = apiKey || 'local';
    this.model = model || '';
    this.temperature = Number(temperature ?? 0.1);
  }

  get configured() {
    return Boolean(this.baseUrl && this.model);
  }

  assertConfigured() {
    if (!this.baseUrl) throw new Error('LLM_BASE_URL is not set (copy .env.example → .env)');
    if (!this.model) throw new Error('LLM_MODEL is not set (copy .env.example → .env)');
  }

  get endpoint() {
    return `${this.baseUrl}/chat/completions`;
  }

  /**
   * One completion round. `tools` is OpenAI tools format (or undefined).
   * Returns the assistant message object: { role, content, tool_calls? }.
   */
  async complete({ messages, tools }) {
    this.assertConfigured();
    const body = {
      model: this.model,
      messages,
      temperature: this.temperature,
    };
    if (tools && tools.length) {
      body.tools = tools;
      body.tool_choice = 'auto';
    }

    // Retry transient upstream failures (429 rate-limit / 5xx overload). Shared
    // provider pools (e.g. OpenRouter free tier) 429 often; a short backoff clears it.
    const maxRetries = Number(process.env.LLM_MAX_RETRIES ?? 4);
    let lastErr = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let res;
      try {
        res = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(body),
        });
      } catch (err) {
        throw new Error(
          `Could not reach LLM at ${this.endpoint} — ${err?.message || err}. ` +
            `Is the server running and LLM_BASE_URL correct?`
        );
      }

      if (res.ok) {
        const data = await res.json();
        const msg = data?.choices?.[0]?.message;
        if (msg) {
          // Normalize models (like Qwen / DeepSeek / Mistral on OpenRouter) that output
          // text-based function calls like `!function_call:{"call": "...", "arguments": {...}}`
          // or `<tool_call>...` instead of the standard structured `msg.tool_calls` array.
          if ((!msg.tool_calls || !msg.tool_calls.length) && typeof msg.content === 'string') {
            const raw = msg.content.trim();
            if (raw.includes('!function_call')) {
              let callName = null;
              let callArgs = {};

              // 1. Try standard JSON parse first
              const fnMatch = raw.match(/!function_call\s*:\s*(\{[\s\S]*\})/);
              if (fnMatch) {
                try {
                  const parsed = JSON.parse(fnMatch[1]);
                  if (parsed.call) {
                    callName = parsed.call;
                    callArgs = parsed.arguments || {};
                  }
                } catch {
                  // Fall back to robust regex extraction if JSON contains raw newlines
                }
              }

              // 2. Resilient fallback for models that output unescaped newlines inside strings
              if (!callName) {
                const nameMatch = raw.match(/"call"\s*:\s*"([^"]+)"/);
                if (nameMatch) {
                  callName = nameMatch[1];
                  // Extract raw arguments chunk
                  const textMatch = raw.match(/"text"\s*:\s*"([\s\S]*)/);
                  if (textMatch) {
                    let cleaned = textMatch[1].trim()
                      .replace(/"\s*\}\s*\}\s*$/, '')
                      .replace(/"\s*\}\s*$/, '')
                      .replace(/"$/, '');
                    callArgs = { text: cleaned };
                  } else {
                    const queryMatch = raw.match(/"query"\s*:\s*"([^"]+)"/);
                    if (queryMatch) callArgs = { query: queryMatch[1] };
                  }
                }
              }

              if (callName) {
                msg.tool_calls = [
                  {
                    id: 'call_' + Math.random().toString(36).slice(2, 10),
                    type: 'function',
                    function: {
                      name: callName,
                      arguments: typeof callArgs === 'string' ? callArgs : JSON.stringify(callArgs),
                    },
                  },
                ];
                msg.content = '';
              }
            }
          }
          return msg;
        }

        // Some providers (e.g. OpenRouter) return an error object inside a 200
        // body — e.g. an upstream 504/aborted/timeout. Treat those like a 5xx.
        const errObj = data?.error;
        const code = Number(errObj?.code);
        const errMsg = errObj?.message || JSON.stringify(data).slice(0, 300);
        const bodyRetryable =
          !!errObj &&
          (code === 429 || code >= 500 || /aborted|timeout|timed out|overloaded|unavailable/i.test(errMsg));
        lastErr = new Error(`LLM error${code ? ' ' + code : ''}: ${errMsg}`);
        if (!bodyRetryable || attempt === maxRetries) throw lastErr;
        await new Promise((r) => setTimeout(r, Math.min(2000 * 2 ** attempt, 20000)));
        continue;
      }

      const detail = await res.text().catch(() => '');
      const retryable = res.status === 429 || res.status >= 500;
      lastErr = new Error(`LLM ${res.status} ${res.statusText}: ${detail.slice(0, 300)}`);
      if (!retryable || attempt === maxRetries) throw lastErr;

      // Honour Retry-After when given; else exponential backoff (2s,4s,8s,16s) capped.
      const ra = Number(res.headers.get('retry-after'));
      const waitMs = Number.isFinite(ra) && ra > 0 ? ra * 1000 : Math.min(2000 * 2 ** attempt, 20000);
      await new Promise((r) => setTimeout(r, waitMs));
    }
    throw lastErr;
  }
}
