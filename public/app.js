// public/app.js
// Talks to the backend over SSE. Persists current conversation in localStorage
// so refreshing the browser resumes the ongoing session seamlessly.

const STORAGE_SESSION_KEY = 'eazitech_session_id';
const STORAGE_HISTORY_KEY = 'eazitech_chat_history';
const STORAGE_EMAIL_KEY = 'eazitech_dev_email';

const thread = document.getElementById('thread');
const form = document.getElementById('composer');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const nsLabel = document.getElementById('nsLabel');
const resetBtn = document.getElementById('reset');
const devEmailInput = document.getElementById('devEmailInput');
const getLinkCodeBtn = document.getElementById('getLinkCodeBtn');
const linkCodeDisplay = document.getElementById('linkCodeDisplay');

let sessionId = loadSessionId();
let busy = false;

// Initialize email input from localStorage
if (devEmailInput) {
  devEmailInput.value = localStorage.getItem(STORAGE_EMAIL_KEY) || '';
  devEmailInput.addEventListener('change', () => {
    const val = devEmailInput.value.trim().toLowerCase();
    if (val) localStorage.setItem(STORAGE_EMAIL_KEY, val);
    else localStorage.removeItem(STORAGE_EMAIL_KEY);
  });
}

if (getLinkCodeBtn) {
  getLinkCodeBtn.addEventListener('click', async () => {
    const email = devEmailInput?.value.trim();
    if (!email) {
      alert('Please enter your developer email first to generate a link code.');
      devEmailInput?.focus();
      return;
    }
    try {
      getLinkCodeBtn.textContent = 'Generating…';
      const res = await fetch('/api/link/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok && data.code) {
        linkCodeDisplay.textContent = `CODE: ${data.code}`;
        linkCodeDisplay.title = 'Type /link ' + data.code + ' in Telegram (@EazitechSupportBot)';
        linkCodeDisplay.classList.remove('hidden');
        systemNote(`📱 One-time Telegram link code: ${data.code} (Send '/link ${data.code}' in @EazitechSupportBot to sync history).`);
      } else {
        alert(data.error || 'Failed to generate link code');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      getLinkCodeBtn.textContent = '📱 Link Telegram';
    }
  });
}

function newId() {
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadSessionId() {
  let id = localStorage.getItem(STORAGE_SESSION_KEY);
  if (!id) {
    id = newId();
    localStorage.setItem(STORAGE_SESSION_KEY, id);
  }
  return id;
}

function saveHistoryMessage(role, text) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY) || '[]');
    list.push({ role, text, time: Date.now() });
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save chat to localStorage', e);
  }
}

function restoreHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (!raw) return;
    const list = JSON.parse(raw);
    if (Array.isArray(list) && list.length > 0) {
      for (const item of list) {
        if (item.role && item.text) {
          addMsg(item.role, item.text, false);
        }
      }
    }
  } catch (e) {
    console.warn('Failed to restore chat from localStorage', e);
  }
}

// ── Health / status light ──────────────────────────────────
async function refreshHealth() {
  try {
    const h = await fetch('/api/health').then((r) => r.json());
    const memOk = h.memwal?.ready;
    statusDot.className = 'dot ' + (memOk ? 'on' : 'off');
    statusText.textContent = memOk ? 'MEMORY ONLINE' : 'MEMORY OFFLINE';
    if (h.memwal?.namespace) nsLabel.textContent = 'NS · ' + h.memwal.namespace;
    if (!memOk && h.memwal?.error) {
      systemNote('Memory offline — ' + h.memwal.error, true);
    }
    if (h.systemPrompt && !h.systemPrompt.found) {
      systemNote('Using placeholder prompt — add support-bot-prompt.md to override.', true);
    }
  } catch {
    statusDot.className = 'dot off';
    statusText.textContent = 'OFFLINE';
  }
}

// Simple clean markdown parser for chat bubbles
function formatMarkdown(raw) {
  if (!raw) return '';
  // Escape basic HTML
  let s = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks: ```code```
  s = s.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Inline code: `code`
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings: ### Header, ## Header, # Header
  s = s.replace(/^### (.*$)/gim, '<div class="md-h3">$1</div>');
  s = s.replace(/^## (.*$)/gim, '<div class="md-h2">$1</div>');
  s = s.replace(/^# (.*$)/gim, '<div class="md-h1">$1</div>');

  // Bold: **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italics: *text* or _text_
  s = s.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');

  // Bullet points
  s = s.replace(/^\s*-\s+(.*$)/gim, '<div class="md-li">• $1</div>');
  s = s.replace(/^\s*\*\s+(.*$)/gim, '<div class="md-li">• $1</div>');

  // Numbered lists: 1. text
  s = s.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div class="md-li"><span class="md-num">$1.</span> $2</div>');

  // Paragraph line breaks
  s = s.replace(/\n\n+/g, '<div class="md-spacer"></div>');
  s = s.replace(/\n/g, '<br/>');

  return s;
}

// ── Rendering ──────────────────────────────────────────────
function addMsg(role, text, save = true) {
  const el = document.createElement('div');
  el.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
  const who = document.createElement('div');
  who.className = 'who';
  who.textContent = role === 'user' ? 'You' : 'Walrus Support';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (role === 'bot') {
    bubble.innerHTML = formatMarkdown(text);
  } else {
    bubble.textContent = text;
  }
  el.append(who, bubble);
  thread.appendChild(el);
  scroll();
  if (save) {
    saveHistoryMessage(role, text);
  }
  return bubble;
}

function systemNote(text, isErr) {
  const el = document.createElement('div');
  el.className = 'mem' + (isErr ? ' err' : '');
  el.innerHTML = `<span class="mdot"></span><span></span>`;
  el.lastChild.textContent = text;
  thread.appendChild(el);
  scroll();
  return el;
}

// A memory-activity chip that we mutate from "pending" → resolved.
function memChip(text) {
  const el = document.createElement('div');
  el.className = 'mem pending';
  el.innerHTML = `<span class="mdot"></span><span class="mtext"></span>`;
  el.querySelector('.mtext').textContent = text;
  thread.appendChild(el);
  scroll();
  return el;
}
function resolveChip(el, text, blobId, ok = true) {
  el.className = 'mem' + (ok ? '' : ' err');
  el.querySelector('.mtext').textContent = text;
  if (blobId) {
    const b = document.createElement('span');
    b.className = 'blob';
    b.textContent = 'blob ' + blobId.slice(0, 10) + '…';
    b.title = blobId;
    el.appendChild(b);
  }
  scroll();
}

function thinking() {
  const el = document.createElement('div');
  el.className = 'mem thinking';
  el.innerHTML = `<span class="mdot"></span><span class="typing"><i></i><i></i><i></i></span>`;
  thread.appendChild(el);
  scroll();
  return el;
}

function scroll() {
  thread.scrollTop = thread.scrollHeight;
}

// Map a tool name to friendly ticker copy.
function toolCopy(tool, phase, detail) {
  const R = {
    memwal_health: ['checking memory…', detail || 'memory checked'],
    memwal_recall: ['recalling past resolutions…', detail ? `recalled ${detail}` : 'recall complete'],
    memwal_remember: ['saving to Walrus…', 'saved to Walrus ✓'],
    memwal_remember_bulk: ['saving batch to Walrus…', 'saved batch to Walrus ✓'],
    memwal_analyze: ['analyzing memory…', 'memory analyzed'],
    memwal_restore: ['restoring memory index…', 'index restored'],
  };
  const pair = R[tool] || [`${tool}…`, `${tool} done`];
  return phase === 'start' ? pair[0] : pair[1];
}

// Append the namespace as a subtle "· ns" suffix.
function withNs(text, ns) {
  return ns ? `${text}  ·  ${ns}` : text;
}

// ── Chat over SSE ──────────────────────────────────────────
async function send(message) {
  busy = true;
  sendBtn.disabled = true;
  input.value = '';
  addMsg('user', message);

  let thinkEl = thinking();
  let activeChips = new Map(); // tool -> chip element (most recent)

  try {
    const email = devEmailInput?.value.trim() || localStorage.getItem(STORAGE_EMAIL_KEY) || '';
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message, email }),
    });
    if (!res.ok || !res.body) throw new Error('HTTP ' + res.status);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      // Parse complete SSE frames (separated by a blank line).
      let idx;
      while ((idx = buf.indexOf('\n\n')) !== -1) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        const { event, data } = parseFrame(frame);
        if (!event) continue;
        handleEvent(event, data);
      }
    }
  } catch (err) {
    if (thinkEl) { thinkEl.remove(); thinkEl = null; }
    systemNote('Error: ' + err.message, true);
  } finally {
    busy = false;
    sendBtn.disabled = false;
    input.focus();
  }

  function handleEvent(event, data) {
    if (event === 'agent_status') {
      if (data.phase === 'memory_offline') {
        systemNote('memory offline (relayer) — answering without recall', true);
        statusDot.className = 'dot off';
        statusText.textContent = 'MEMORY OFFLINE';
      }
      // keep the single thinking indicator alive
      if (!thinkEl) thinkEl = thinking();
    } else if (event === 'tool_start') {
      if (thinkEl) { thinkEl.remove(); thinkEl = null; }
      const chip = memChip(withNs(toolCopy(data.tool, 'start'), data.namespace));
      activeChips.set(data.tool, chip);
    } else if (event === 'tool_end') {
      const chip = activeChips.get(data.tool);
      const copy = withNs(toolCopy(data.tool, 'end', data.detail), data.namespace);
      if (chip) resolveChip(chip, copy, data.blobId, data.ok);
      else resolveChip(memChip(copy), copy, data.blobId, data.ok);
      activeChips.delete(data.tool);
      thinkEl = thinking(); // model will think again after the tool
    } else if (event === 'reply') {
      if (thinkEl) { thinkEl.remove(); thinkEl = null; }
      addMsg('bot', data.text || '(no response)');
    } else if (event === 'error') {
      if (thinkEl) { thinkEl.remove(); thinkEl = null; }
      systemNote('Error: ' + (data.message || 'unknown'), true);
    }
  }
}

function parseFrame(frame) {
  let event = null;
  const dataLines = [];
  for (const line of frame.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }
  let data = {};
  if (dataLines.length) {
    try { data = JSON.parse(dataLines.join('\n')); } catch { data = { raw: dataLines.join('\n') }; }
  }
  return { event, data };
}

// ── Wiring ─────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg || busy) return;
  send(msg);
});

resetBtn.addEventListener('click', async () => {
  if (busy) return;
  await fetch('/api/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  }).catch(() => {});
  sessionId = newId();
  localStorage.setItem(STORAGE_SESSION_KEY, sessionId);
  localStorage.removeItem(STORAGE_HISTORY_KEY);
  thread.innerHTML = '';
  systemNote('New session started.');
  input.focus();
});

restoreHistory();
refreshHealth();
input.focus();
