// server/demo-conversation.js  ·  npm run demo
//
// Drives a scripted support conversation through the LIVE server (/api/chat) and
// prints the tool activity + Walrus blob ids as they happen. Proves the loop:
// the model recalls, answers, and remembers — across two separate sessions, so
// the second customer benefits from the first ticket's stored resolution.
//
// Requires the server to be running (npm start). Override messages by editing
// TURNS below.

const PORT = Number(process.env.PORT || 8787);
const BASE = `http://localhost:${PORT}`;

// A realistic arc: Customer A hits an issue and finds the fix (bot should
// REMEMBER it), then Customer B in a separate session hits the same issue (bot
// should RECALL the stored fix and lead with it).
const TURNS = [
  {
    session: 'demo-A',
    label: 'Customer A · msg 1 — reports the issue',
    message:
      "Hi, I can't reset my password — I click 'forgot password' but the reset email never arrives, even after 20 minutes. I'm on the Pro plan, email jane@acme.com.",
  },
  {
    session: 'demo-A',
    label: 'Customer A · msg 2 — issue gets RESOLVED (expect memwal_remember)',
    message:
      "Oh — I just found it. The reset email was in my spam folder the whole time. I whitelisted no-reply@eazitech.xyz and the link worked, I'm back in. Thanks!",
  },
  {
    session: 'demo-B',
    label: 'Customer B · fresh session — same issue (expect memwal_recall to lead with the stored fix)',
    message:
      "My password reset emails just aren't showing up in my inbox. Can you help?",
  },
];

const C = { dim: '\x1b[2m', b: '\x1b[1m', g: '\x1b[32m', y: '\x1b[33m', c: '\x1b[36m', r: '\x1b[0m' };

async function runTurn({ session, label, message }) {
  console.log(`\n${C.b}━━ ${label} ━━${C.r}`);
  console.log(`${C.c}customer:${C.r} ${message}`);

  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: session, message }),
  });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  const blobs = [];

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n\n')) !== -1) {
      const frame = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      let event = null;
      const dataLines = [];
      for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
      }
      let data = {};
      try { data = JSON.parse(dataLines.join('\n')); } catch {}

      if (event === 'tool_start') {
        console.log(`  ${C.y}→ ${data.tool}${C.r} ${C.dim}[ns:${data.namespace}]${C.r} ${data.preview ? '“' + data.preview + '”' : ''}`);
      } else if (event === 'tool_end') {
        const mark = data.ok ? C.g + '✓' : C.r + '✗';
        console.log(`  ${mark} ${data.tool}${C.r} ${C.dim}[ns:${data.namespace}]${C.r} ${data.detail || ''}${data.blobId ? `  ${C.g}blob=${data.blobId}${C.r}` : ''}`);
        if (data.blobId) blobs.push(data.blobId);
      } else if (event === 'reply') {
        console.log(`\n  ${C.b}agent:${C.r} ${data.text}\n`);
      } else if (event === 'error') {
        console.log(`  ${C.r}error: ${data.message}${C.r}`);
      }
    }
  }
  return blobs;
}

try {
  const health = await fetch(`${BASE}/api/health`).then((r) => r.json());
  if (!health.memwal?.ready) throw new Error('MemWal not ready — check the server log');
  console.log(`${C.dim}server ok · wallet ${health.memwal.wallet?.accountId?.slice(0, 12)}… · model ${health.llm.model}${C.r}`);

  // Clean slate for the demo sessions so reruns start fresh.
  for (const s of new Set(TURNS.map((t) => t.session))) {
    await fetch(`${BASE}/api/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: s }),
    }).catch(() => {});
  }

  const allBlobs = [];
  for (const turn of TURNS) {
    const blobs = await runTurn(turn);
    allBlobs.push(...blobs);
    // brief pause so a write from turn 1 is indexed before turn 2 recalls it
    await new Promise((r) => setTimeout(r, 2500));
  }

  console.log(`${C.b}Walrus blobs written this run:${C.r} ${allBlobs.length}`);
  for (const b of allBlobs) console.log(`  https://walruscan.com/mainnet/blob/${b}`);
} catch (err) {
  console.error('demo failed:', err.message);
  console.error('Is the server running?  npm start');
  process.exit(1);
}
