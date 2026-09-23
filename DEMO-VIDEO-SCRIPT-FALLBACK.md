# Fallback Demo Script — EAZITECH Support Agent (relayer offline)

**Length:** ~2:00 · **When to use this:** the Walrus relayer is down, so live recall/write won't work. This version turns that into the point — the memory is on Walrus, the relayer is just a cache in front of it, and the agent stays honest when it can't reach it.

The two things this proves: the agent **refuses to fake** an answer it can't verify, and the memories it already wrote are **permanently on Walrus mainnet**, reachable even while the live service is down.

---

## Before you record

- [ ] App running at http://localhost:8787 (model: gpt-4o)
- [ ] Top-right shows the dot as OFFLINE — that's expected and it's part of the story here
- [ ] Two tabs: Tab 1 the chat, Tab 2 for walruscan / suiscan
- [ ] Have this text ready to show on screen in beat 3 (an actual memory the agent wrote):
```
Symptom: Video exports rendered blurry on export.
Context: Export preset set to 720p while source footage was 1080p.
Ruled out: Source footage quality, rendering issues, codec problems, scaling filters.
Worked: Changed export preset from 720p to 1080p to match source resolution.
Root cause: Export preset lower than source resolution → downscale + blur.
Verification: Client confirmed the fix after adjusting the preset. Confidence: verified.
```

---

## The script

### 0:00 – 0:25 · Open, and set up the honest frame

**On screen:** the chat page — cream UI, "EAZITΞCH" wordmark, the `00 · CUSTOMER SUPPORT / MEMORY ON WALRUS` strip.

**Say:**
> "This is a customer-support agent for EAZITECH. Its memory doesn't live in the chat or a local database — it lives on Walrus. The relayer that fronts that memory is having an outage right now, so I'm going to show you something better than a happy path: what this agent does when it can't reach its memory, and the fact that everything it already wrote is still on Walrus mainnet."

*(Point at the OFFLINE dot, top right. Don't hide it — it's the setup.)*

---

### 0:25 – 1:05 · Integrity — it won't hallucinate

**Type and send:**
> `Hey, a client says the video edits you delivered are rendering blurry on export. Can you help?`

**On screen:** the ticker shows a memory check that fails, then the reply:
> *"I'm sorry, but support is temporarily unavailable at the moment. Please try again shortly."*

**Say:**
> "It checked its memory, couldn't reach it, and stopped. It didn't guess. Most support bots would confidently invent a fix here — this one treats the company's real history as a hard requirement, so it says nothing it can't back up. And notice what the customer sees: a plain, human line. No error codes, no talk of tools or memory. The machinery stays hidden."

---

### 1:05 – 1:50 · Permanence — the memory is already on Walrus

**On screen:** Tab 2. Open the account object first:
`https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4`

**Say:**
> "Here's the agent's memory account on Sui mainnet — a MemWalAccount object the company owns. This is where the resolved-issue history lives."

**On screen:** open a blob:
`https://walruscan.com/mainnet/blob/vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA`
Then bring up the stored-memory text you prepared.

**Say:**
> "And here's an actual memory it wrote, as a blob on Walrus. A blurry-export ticket, turned into a structured record — symptom, what was ruled out, the fix, the root cause, confidence. The relayer being down doesn't touch any of this. The data's on Walrus, owned by the account, and it's provably here right now. When the relayer comes back, a fresh agent — on any model, any platform — reads this and picks up cold."

---

### 1:50 – 2:10 · Close

**On screen:** back to the chat.

**Say:**
> "So: a support agent that turns every fix into knowledge the company keeps, stored where it can't be locked in or quietly lost — and one honest enough to go quiet when it can't reach that memory instead of making something up. That's the point of putting it on Walrus."

---

## Notes

- The refusal line is verified — it's exactly what you'll see, no leaks. Send the message once and let it land.
- If the relayer happens to recover mid-recording (dot turns green), you can switch to the full script and show live recall instead. Either way you've got a demo.
- Keep beat 3 unhurried. The walruscan/suiscan pages loading is the proof; let them breathe.
