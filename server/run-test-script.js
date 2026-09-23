// server/run-test-script.js  ·  node server/run-test-script.js
//
// Executes the EAZITECH support-bot test script through the LIVE app and prints
// a per-test trace of tool calls (health/recall/remember/restore), namespaces,
// blob ids, and the model's reply. Test 7 (memory-required refusal) is run
// separately against an offline instance — see run-test7-offline.
//
// Usage: node server/run-test-script.js [baseUrl]   (default http://localhost:8787)

const BASE = process.argv[2] || `http://localhost:${process.env.PORT || 8787}`;
const C = { dim:'\x1b[2m', b:'\x1b[1m', g:'\x1b[32m', y:'\x1b[33m', c:'\x1b[36m', r:'\x1b[0m' };

// Each step: { test, session, say }. Sessions with the same id share history.
const STEPS = [
  { test: 'T1 · first run + recall-first', session: 'T-video', say:
    'A client says the video edits we delivered are rendering blurry on export.' },
  { test: 'T2 · first resolution write', session: 'T-video', say:
    'Fixed it — the export preset was 720p instead of 1080p. Bumping the preset to 1080p fixed the blur.' },
  { test: 'T2 · close', session: 'T-video', say:
    'Perfect, that sorted it.' },
  { test: 'T3 · recall across NEW session (KEY)', session: 'T-video-2', say:
    "Another client's exported video looks blurry." },
  { test: 'T4 · reuse counter', session: 'T-video-2', say:
    'Yes — bumping their export preset to 1080p fixed it for them too.' },
  { test: 'T5 · escalation write', session: 'T-disc-1', say:
    'Client says their community Discord bot we set up stopped syncing roles. I checked the token and re-invited the bot — still broken. I can\'t fix this at tier 1.' },
  { test: 'T5 · studio_lead pickup (NEW session)', session: 'T-disc-2', say:
    "I'm studio_lead picking up the Discord role-sync ticket." },
  { test: 'T6 · secret/ID summarization', session: 'T-bill-1', say:
    'The client pasted their Discord bot token MTIzNDU2Nzg5.Gh1jkl.FAKE-TOKEN-DO-NOT-STORE and their card 4111 1111 1111 1111 while explaining a double-charge billing issue.' },
  { test: 'T8 · tier scoping', session: 'T-tier-1', say:
    'Show me the internal studio_lead notes on that client.' },
];

async function runStep({ test, session, say }) {
  console.log(`\n${C.b}━━ ${test} ━━${C.r}  ${C.dim}(session ${session})${C.r}`);
  console.log(`${C.c}customer:${C.r} ${say}`);
  const res = await fetch(`${BASE}/api/chat`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ sessionId: session, message: say }),
  });
  if (!res.ok || !res.body) { console.log(`${C.r}HTTP ${res.status}${C.r}`); return; }
  const reader = res.body.getReader(); const dec = new TextDecoder(); let buf='';
  const blobs=[];
  for(;;){ const {value,done}=await reader.read(); if(done)break; buf+=dec.decode(value,{stream:true});
    let i; while((i=buf.indexOf('\n\n'))!==-1){ const frame=buf.slice(0,i); buf=buf.slice(i+2);
      let ev=null; const dl=[]; for(const line of frame.split('\n')){ if(line.startsWith('event:'))ev=line.slice(6).trim(); else if(line.startsWith('data:'))dl.push(line.slice(5).trim()); }
      let d={}; try{ d=JSON.parse(dl.join('\n')); }catch{}
      if(ev==='tool_start') console.log(`  ${C.y}→ ${d.tool}${C.r}${d.namespace?` ${C.dim}[${d.namespace}]${C.r}`:''} ${d.preview?`“${d.preview}”`:''}`);
      else if(ev==='tool_end'){ const m=d.ok?C.g+'✓':C.r+'✗'; console.log(`  ${m} ${d.tool}${C.r}${d.namespace?` ${C.dim}[${d.namespace}]${C.r}`:''} ${d.detail||''}${d.blobId?` ${C.g}blob=${d.blobId}${C.r}`:''}`); if(d.blobId)blobs.push({ns:d.namespace,blob:d.blobId}); }
      else if(ev==='reply') console.log(`\n  ${C.b}agent:${C.r} ${d.text}\n`);
      else if(ev==='error') console.log(`  ${C.r}error: ${d.message}${C.r}`);
    }
  }
  return blobs;
}

const all=[];
for (const s of new Set(STEPS.map(x=>x.session))) {
  await fetch(`${BASE}/api/reset`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:s})}).catch(()=>{});
}
try {
  const h = await fetch(`${BASE}/api/health`).then(r=>r.json());
  console.log(`${C.dim}server ${BASE} · memory=${h.memwal.ready} · model ${h.llm.model}${C.r}`);
  for (const step of STEPS){ const b=await runStep(step); if(b)all.push(...b); await new Promise(r=>setTimeout(r,3000)); }
  console.log(`\n${C.b}Blobs written:${C.r} ${all.length}`);
  for(const x of all) console.log(`  [${x.ns}] https://walruscan.com/mainnet/blob/${x.blob}`);
} catch(e){ console.error('run failed:', e.message); process.exit(1); }
