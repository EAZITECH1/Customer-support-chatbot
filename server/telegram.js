// server/telegram.js
// Telegram Bot interface for EAZITECH Customer Support Chat.
// Powered by Walrus Memory (MemWal MCP) and OpenAI-compatible LLM.

import 'dotenv/config';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { MemWal, summarizeToolResult } from './memwal.js';
import { LLM } from './llm.js';
import { SessionStore, pruneTranscript } from './store.js';
import { materializeCredentials } from './credentials.js';
import { linkManager } from './link.js';

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
      'You are a helpful customer-support chatbot for EAZITECH. ' +
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
      `👋 *Welcome to Walrus Ecosystem Support*\n\n` +
      `I am an autonomous developer assistant chatbot with persistent institutional memory powered by *Walrus Memory*.\n\n` +
      `*Supported Walrus Pillars:*\n` +
      `• *Walrus*: Core storage, CLI, epochs, Sui gas coin merging\n` +
      `• *Walrus Memory*: MemWal MCP agent memory & Seal encryption\n` +
      `• *Walrus Console*: Web console, buckets & identity pairing\n` +
      `• *Walrus Skills*: Coding agent skills (Claude Code, Cursor, AGY)\n` +
      `• *Walrus Oyster API*: S3-compatible REST API (AWS CLI / boto3)\n\n` +
      `*Bot Commands:*\n` +
      `• \`/start\` — Welcome greeting and stack overview\n` +
      `• \`/help\` — Detailed commands and developer guide\n` +
      `• \`/reset\` — Reset ticket context to test clean session recall\n` +
      `• \`/link WAL-XXXX\` — Link identity to Web Portal\n` +
      `• \`/status\` — View Walrus Memory and agent runtime status\n\n` +
      `💡 _Ask any technical question or paste CLI error traces to search on-chain runbooks._`;
    await sendMessage(chatId, welcome);
    return;
  }

  if (text === '/help') {
    const helpMsg =
      `🛠️ *Walrus Dev Support — Command Directory*\n\n` +
      `Here are the commands you can use in this chat:\n\n` +
      `• \`/start\` — Restart session greeting and view ecosystem pillars\n` +
      `• \`/help\` — Display this command directory\n` +
      `• \`/reset\` — Reset ticket context to test clean session recall\n` +
      `• \`/link WAL-XXXX\` — Link your identity with the Web Portal\n` +
      `• \`/status\` — View real-time Walrus Memory connectivity and runtime status\n\n` +
      `*How Memory Works:*\n` +
      `1. When you report a bug, the bot calls \`memwal_recall\` against Walrus.\n` +
      `2. If a verified runbook exists, it delivers the fix immediately.\n` +
      `3. When a solution is confirmed, it commits an immutable blob to Walrus via \`memwal_remember\`.\n\n` +
      `_(You can also tap Telegram's Menu button [/] to quickly trigger these commands.)_`;
    await sendMessage(chatId, helpMsg);
    return;
  }

  if (text === '/status') {
    let healthStr = 'checking…';
    try {
      const curMemwal = activeMemwal || memwal;
      if (curMemwal) {
        const h = await curMemwal.health();
        healthStr = h.ok ? '🟢 ONLINE (Healthy)' : '🔴 UNHEALTHY';
      } else {
        healthStr = '🟡 STANDBY';
      }
    } catch (e) {
      healthStr = '⚠️ ERROR: ' + e.message;
    }

    const identity = linkManager.getIdentityByTelegramId(userId);
    const linkStr = identity
      ? `🟢 Linked to \`${identity.email}\` (${identity.tenant})`
      : '⚪ Not linked (Use `/link WAL-XXXX` to sync Web chat)';

    const statusMsg =
      `📊 *Walrus Dev Support — System Status*\n\n` +
      `• *Walrus Memory*: ${healthStr}\n` +
      `• *Storage Network*: Sui Mainnet / Walrus Mainnet\n` +
      `• *Protocol*: \`@mysten-incubation/memwal-mcp\` (v0.0.7)\n` +
      `• *Default Namespace*: \`${NAMESPACE}\`\n` +
      `• *Model*: Google Gemini 2.5 Flash via OpenRouter\n` +
      `• *Identity Link*: ${linkStr}\n\n` +
      `*Commands:* /start · /help · /reset · /link · /status`;
    await sendMessage(chatId, statusMsg);
    return;
  }

  if (text.startsWith('/link')) {
    const parts = text.trim().split(/\s+/);
    if (parts.length < 2) {
      await sendMessage(
        chatId,
        `⚠️ *Usage*: \`/link WAL-XXXX\`\n\nGenerate your 6-digit link code on the Web Portal, then paste it here to link your account.`
      );
      return;
    }
    const code = parts[1];
    const res = linkManager.redeemCode(code, { id: userId, chatId, username });
    if (res.ok) {
      await sendMessage(
        chatId,
        `✅ *Identity Linked Successfully!*\n\n` +
        `• *Developer Email*: \`${res.email}\`\n` +
        `• *Tenant*: \`${res.tenant}\`\n\n` +
        `Your open tickets and context from the Web Portal are now synchronized to this chat!`
      );
    } else {
      await sendMessage(chatId, `❌ *Link Failed*: ${res.error}`);
    }
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

    // Check if this Telegram user has linked their web identity
    const identity = linkManager.getIdentityByTelegramId(userId);
    let customerTag = '';
    if (identity) {
      customerTag = `[Developer: ${identity.email} (Tenant: ${identity.tenant}, Telegram: @${username || userId})] `;
    } else {
      customerTag = username ? `[Telegram User: @${username} (id: ${userId})] ` : `[Telegram User ID: ${userId}] `;
    }

    const transcript = pruneTranscript(session.messages.slice());
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
        messages: [{ role: 'system', content: system }, ...pruneTranscript(transcript)],
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

        const safeToolText = (result.text || (result.ok ? 'ok' : 'error')).slice(0, 10000);
        transcript.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: safeToolText,
        });
      }
    }

    if (finalText === null) {
      const forced = await curLlm.complete({
        messages: [{ role: 'system', content: system }, ...pruneTranscript(transcript)],
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

  // Ensure commands are cleanly lined up in Telegram UI Menu button
  try {
    const cmdRes = await tgCall('setMyCommands', {
      commands: [
        { command: 'start', description: 'Start Walrus Dev Support & stack overview' },
        { command: 'help', description: 'Show available commands & Walrus pillars' },
        { command: 'reset', description: 'Reset ticket context & start fresh session' },
        { command: 'link', description: 'Link identity to Web Portal (WAL-XXXX)' },
        { command: 'status', description: 'Check Walrus Memory & bot operational health' },
      ],
    });
    if (cmdRes.ok) {
      console.log('[telegram] Bot commands lined up and registered with Telegram.');
    }
  } catch (cmdErr) {
    console.warn('[telegram] Failed to register commands with Telegram:', cmdErr.message);
  }

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
