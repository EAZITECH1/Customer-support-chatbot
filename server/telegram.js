// server/telegram.js
// Telegram Bot interface for EAZITECH Customer Support Chat.
// Powered by Walrus Memory (MemWal MCP) and OpenAI-compatible LLM.

import 'dotenv/config';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { MemWal, summarizeToolResult } from './memwal.js';
import { LLM } from './llm.js';
import { SessionStore } from './store.js';
import { materializeCredentials } from './credentials.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROMPT_PATH = join(ROOT, 'support-agent-prompt.md');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = TOKEN ? `https://api.telegram.org/bot${TOKEN}` : null;
const MAX_ROUNDS = Number(process.env.LLM_MAX_TOOL_ROUNDS || 6);
const NAMESPACE = process.env.MEMWAL_NAMESPACE || 'support';
const MEMWAL_HOME = join(ROOT, '.memwal-home');

// ── Boot dependencies ────────────────────────────────────────────────────────
const store = new SessionStore(join(ROOT, 'data', 'telegram-sessions.json'));

let llm = null;
let memwal = null;
let walletInfo = null;

function initStandalone() {
  if (llm && memwal) return;
  llm = new LLM({
    baseUrl: process.env.LLM_BASE_URL,
    apiKey: process.env.LLM_API_KEY,
    model: process.env.LLM_MODEL,
    temperature: process.env.LLM_TEMPERATURE,
  });

  try {
    walletInfo = materializeCredentials(process.env.MEMWAL_CREDENTIALS_JSON, MEMWAL_HOME);
  } catch (err) {
    console.error('[memwal] credential error:', err.message);
  }

  memwal = new MemWal({
    spec: process.env.MEMWAL_MCP_SPEC,
    namespace: NAMESPACE,
    debug: process.env.MEMWAL_MCP_DEBUG === '1',
    home: walletInfo ? MEMWAL_HOME : undefined,
  });
}

let activeMemwal = null;
let activeLlm = null;
let activeEnsureMemWal = null;

let memwalReady = false;
let memwalToolNames = [];
let memwalError = null;
let lastConnectAt = 0;
let connecting = null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connectOnce() {
  const target = activeMemwal || memwal;
  if (!target) return;
  memwalToolNames = await target.connect();
  memwalReady = true;
  memwalError = null;
  lastConnectAt = Date.now();
  const via = walletInfo
    ? `wallet=${walletInfo.accountId.slice(0, 10)}… (from .env, isolated HOME)`
    : 'wallet=machine default (~/.memwal)';
  console.log(`[memwal] ready · ${via} · default-ns="${NAMESPACE}" · tools: ${memwalToolNames.join(', ')}`);
}

async function initMemWal(attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      await connectOnce();
      return;
    } catch (err) {
      memwalReady = false;
      memwalError = err.message;
      lastConnectAt = Date.now();
      if (i < attempts - 1) {
        console.warn(`[memwal] connect attempt ${i + 1} failed (${err.message}); retrying…`);
        await sleep(2500 * (i + 1));
      } else {
        console.error('[memwal] FAILED to connect:', err.message);
      }
    }
  }
}

async function ensureMemWal() {
  if (memwalReady) return true;
  if (connecting) return connecting;
  if (Date.now() - lastConnectAt < 12000) return false;
  connecting = (async () => {
    try {
      await connectOnce();
      return true;
    } catch (err) {
      memwalReady = false;
      memwalError = err.message;
      lastConnectAt = Date.now();
      return false;
    } finally {
      connecting = null;
    }
  })();
  return connecting;
}

// ── System prompt ─────────────────────────────────────────────────────────────
function loadSystemPrompt() {
  let base;
  if (existsSync(PROMPT_PATH)) {
    base = readFileSync(PROMPT_PATH, 'utf8').trim();
  } else {
    base =
      'You are a helpful customer-support agent for EAZITECH. ' +
      'Be warm, direct, and solution-focused.';
  }
  const runtime = [
    '',
    '---',
    '[Runtime context]',
    `Today is ${new Date().toISOString().slice(0, 10)}.`,
    'Channel: Telegram.',
    'Tools available in THIS deployment: memwal_health, memwal_recall, memwal_remember, ' +
      'memwal_remember_bulk, memwal_analyze, memwal_restore.',
    'Do not leak internal tool names, namespaces, or blob IDs to the customer. ' +
      'Keep replies clear and well-formatted for Telegram messaging.',
  ].join('\n');
  return base + '\n' + runtime;
}

const HEALTH_TOOL = {
  type: 'function',
  function: {
    name: 'memwal_health',
    description: 'Check Walrus Memory connectivity. Returns HEALTHY or UNHEALTHY.',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
  },
};

// ── Telegram API Helpers ───────────────────────────────────────────────────────
async function tgCall(method, body = {}) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function sendTyping(chatId) {
  try {
    await tgCall('sendChatAction', { chat_id: chatId, action: 'typing' });
  } catch {
    /* ignore */
  }
}

async function sendMessage(chatId, text) {
  return tgCall('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  }).catch(async () => {
    // Fallback without Markdown if parsing fails due to special characters
    return tgCall('sendMessage', { chat_id: chatId, text });
  });
}

// ── Process Message ───────────────────────────────────────────────────────────
async function handleUserMessage(chatId, userId, username, text) {
  if (text === '/start') {
    const welcome =
      `👋 *Welcome to EAZITECH Customer Support*\n\n` +
      `I am your dedicated support agent with persistent institutional memory on *Walrus*.\n\n` +
      `How can I assist you with your project deliverables, video exports, content, or technical setup today?\n\n` +
      `_(Type /reset at any time to start a fresh support ticket)_`;
    await sendMessage(chatId, welcome);
    return;
  }

  if (text === '/reset') {
    store.reset(`tg-${chatId}`);
    await sendMessage(chatId, `🔄 *Ticket reset.* Started a fresh support session.`);
    return;
  }

  // Keep sending typing action while background LLM & MemWal tool calls run
  const typingInterval = setInterval(() => sendTyping(chatId), 4000);
  sendTyping(chatId);

  try {
    const sessionId = `tg-${chatId}`;
    const system = loadSystemPrompt();
    const session = store.get(sessionId);

    // Identify user in transcript if known
    const customerTag = username ? `[Telegram User: @${username} (id: ${userId})] ` : `[Telegram User ID: ${userId}] `;
    const transcript = session.messages.slice();
    transcript.push({ role: 'user', content: customerTag + text });

    if (activeEnsureMemWal) {
      await activeEnsureMemWal();
    } else {
      await ensureMemWal();
    }
    const curMemwal = activeMemwal || memwal;
    const curLlm = activeLlm || llm;
    const tools = [HEALTH_TOOL, ...(curMemwal?.tools?.length ? curMemwal.asOpenAITools() : [])];
    let finalText = null;

    for (let round = 0; round < MAX_ROUNDS; round++) {
      sendTyping(chatId);

      const assistant = await curLlm.complete({
        messages: [{ role: 'system', content: system }, ...transcript],
        tools,
      });

      const toolCalls = assistant.tool_calls || [];
      transcript.push({
        role: 'assistant',
        content: assistant.content ?? '',
        ...(toolCalls.length ? { tool_calls: toolCalls } : {}),
      });

      if (!toolCalls.length) {
        finalText = assistant.content || '';
        break;
      }

      for (const tc of toolCalls) {
        const name = tc.function?.name;
        let args = {};
        try {
          args = tc.function?.arguments ? JSON.parse(tc.function.arguments) : {};
        } catch {
          args = {};
        }

        const isHealth = name === 'memwal_health';
        console.log(`[telegram] tool: ${name} ns=${args?.namespace || NAMESPACE}`);

        let result;
        if (isHealth) {
          const h = await curMemwal.health();
          result = {
            ok: h.ok,
            text: h.ok
              ? `HEALTHY. Walrus Memory reachable. Memory is live.`
              : `UNHEALTHY: Walrus Memory unavailable.`,
          };
        } else if (curMemwal.isMemoryTool(name)) {
          result = await curMemwal.call(name, args);
        } else {
          result = { ok: false, text: `Unknown tool: ${name}` };
        }

        transcript.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: result.text || (result.ok ? 'ok' : 'error'),
        });
      }
    }

    if (finalText === null) {
      const forced = await curLlm.complete({
        messages: [{ role: 'system', content: system }, ...transcript],
      });
      finalText = forced.content || 'I have recorded your issue and am reviewing past resolutions.';
    }

    // Persist conversation
    store.setMessages(sessionId, transcript);

    clearInterval(typingInterval);
    await sendMessage(chatId, finalText);
  } catch (err) {
    clearInterval(typingInterval);
    console.error('[telegram] error processing message:', err);
    await sendMessage(chatId, `⚠️ Sorry, an issue occurred while processing your request. Please try again shortly.`);
  }
}

// ── Long Polling Loop ─────────────────────────────────────────────────────────
async function startPolling() {
  if (!activeEnsureMemWal) {
    console.log('[telegram] connecting to Walrus Memory relayer…');
    await initMemWal();
  }

  const me = await tgCall('getMe');
  if (!me.ok) {
    console.error('[telegram] Failed to verify bot token:', me);
    process.exit(1);
  }
  console.log(`[telegram] Logged in as @${me.result.username} (${me.result.first_name})`);
  console.log('[telegram] Bot is now active and listening for messages…');

  let offset = 0;
  while (true) {
    try {
      const res = await tgCall('getUpdates', {
        offset,
        timeout: 30,
        allowed_updates: ['message'],
      });

      if (res.ok && Array.isArray(res.result)) {
        for (const update of res.result) {
          offset = update.update_id + 1;
          const msg = update.message;
          if (!msg || !msg.text) continue;

          const chatId = msg.chat.id;
          const userId = msg.from?.id;
          const username = msg.from?.username;
          const text = msg.text.trim();

          console.log(`[telegram] [chat ${chatId}] <@${username || userId}>: ${text}`);
          handleUserMessage(chatId, userId, username, text).catch((err) =>
            console.error('[telegram] handleUserMessage unhandled:', err)
          );
        }
      } else if (!res.ok) {
        console.warn('[telegram] getUpdates error:', res);
        await sleep(3000);
      }
    } catch (err) {
      console.warn('[telegram] network error polling getUpdates:', err.message);
      await sleep(3000);
    }
  }
}

export async function startTelegramBot(options = {}) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('[telegram] TELEGRAM_BOT_TOKEN not configured; skipping Telegram bot.');
    return;
  }

  if (options.memwal) activeMemwal = options.memwal;
  if (options.llm) activeLlm = options.llm;
  if (options.ensureMemWal) activeEnsureMemWal = options.ensureMemWal;

  if (!activeMemwal || !activeLlm) {
    initStandalone();
    if (!activeMemwal) activeMemwal = memwal;
    if (!activeLlm) activeLlm = llm;
    if (!activeEnsureMemWal) activeEnsureMemWal = ensureMemWal;
  }

  console.log('[telegram] Starting Telegram polling loop…');
  startPolling().catch((err) => {
    console.error('[telegram] Fatal polling error:', err);
  });
}

const isMain = process.argv[1] && process.argv[1].endsWith('telegram.js');
if (isMain) {
  startTelegramBot();
}
