# Demo Video Script — EAZITECH Support Agent (localhost)

**Target length:** ~2:30–3:00 · **Format:** desktop screen recording · **URL:** http://localhost:8787

The one thing this video proves: **the agent remembers a fix from one conversation and reuses it in a completely separate conversation — because the memory lives on Walrus, not in the chat.**

---

## Before you hit record (prep checklist)

- [ ] Server running: `cd ~/eazitech-support-chat && npm start` → open **http://localhost:8787**
- [ ] Top-right shows a green dot + **MEMORY ONLINE** (if it says OFFLINE, the relayer is down — wait and reload)
- [ ] Model is the paid one (`nvidia/nemotron-3-ultra-550b-a55b`) so replies are clean and there's no rate-limit stall
- [ ] Have two browser tabs ready: **Tab 1** the chat, **Tab 2** blank (for the on-chain proof at the end)
- [ ] Record at 1080p, browser zoomed so the chat + the memory ticker chips are clearly legible
- [ ] Each reply takes ~15–20s. Either narrate over the wait, or trim the dead air in editing.

---

## The script

### 0:00 – 0:20 · Open

**On screen:** the loaded chat page — cream UI, "EAZITΞCH" wordmark, the `00 · CUSTOMER SUPPORT / MEMORY ON WALRUS` strip, big "How can we help." headline, green **MEMORY ONLINE**.

**Say:**
> "This is a customer-support agent for EAZITECH, a Web3 creator studio. It looks like a normal support chat — but every issue it resolves gets written to Walrus as durable memory the company owns. Watch the line under each message: that's the agent reading and writing memory live."

---

### 0:20 – 1:00 · Ticket #1 — a new problem

**Type (as the customer) and send:**
> `Hey, a client says the video edits you delivered are rendering blurry on export.`

**On screen:** point out the ticker chips as they appear — `checking memory…`, then `recalling past resolutions… · resolved-video`, resolving to a recall result. Then the agent's reply.

**Say (over the wait):**
> "Before it answers, it checks its memory and searches the `resolved-video` namespace for anything similar. It troubleshoots and asks the client to confirm the cause."

---

### 1:00 – 1:30 · The fix — and the write to Walrus

**Type and send:**
> `Fixed it — the export preset was 720p; bumping it to 1080p cleared the blur.`

**On screen:** the ticker shows a **save** chip — `saved to Walrus ✓ · resolved-video` (with a `blob …` tag). The agent closes normally.

**Say:**
> "Now that it's resolved, the agent writes a structured record to Walrus — the symptom, what was ruled out, the fix — and you can see the blob reference. Notice it does **not** tell the customer 'I saved this.' The storage is invisible to the client; only the operator sees it."

*(If the save chip lags — the relayer sometimes delays the response — don't worry: the next step proves the memory landed.)*

---

### 1:30 – 2:20 · The payoff — a brand-new conversation

**On screen:** click **↺ new session** (bottom left). The thread clears — a fresh, separate session.

**Say:**
> "New session. Different customer. The chat has no memory of what just happened — but Walrus does."

**Type and send:**
> `Another client's exported video is coming out blurry.`

**On screen:** the ticker shows `recalling past resolutions… · resolved-video` → `recalled 1 past resolution`. The agent's reply **leads with the stored fix**.

**Say:**
> "It recalls the resolution from the last conversation and opens with it — 'this is a known issue, it's the export preset resolution, bump it to match the source.' The fix survived the session boundary because it was never in the chat. It was on Walrus."

---

### 2:20 – 2:50 · Proof it's real, on mainnet

**On screen:** switch to Tab 2, paste a blob link:
`https://walruscan.com/mainnet/blob/vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA`
then the account object:
`https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4`

**Say:**
> "This isn't a local database. Here's one of the memories as a blob on Walrus, and here's the agent's MemWalAccount object on Sui mainnet holding them. The company owns this account — so if EAZITECH switched models or support tools tomorrow, the entire resolved-issue history moves with them."

---

### 2:50 – 3:00 · Close

**On screen:** back to the chat.

**Say:**
> "A support bot that actually gets smarter, and a knowledge base the company keeps — portable, verifiable, and provider-independent. Built on Walrus Memory."

---

## Optional bonus shot — "memory is required" (only if you want a 4th act)

Stop the memory connection (or run the app with an unreachable relayer), reload, and ask a question. The agent **refuses** to answer from general knowledge and gives a brief "support system is temporarily unavailable" line — never guessing. It's a strong point: this agent won't fake institutional memory it doesn't have. *(Skip if you want to keep the video tight.)*

---

## Delivery tips

- Lead with the payoff in your first sentence if the video needs a hook: "Watch a support bot remember a fix across two totally separate chats."
- Keep your customer messages short and natural — you're playing a busy account manager, not writing an essay.
- The memory ticker is the star. Make sure it's readable; consider a subtle zoom on it during the recall moment.
- If a reply is slow, cut the wait in editing — don't let a 15s pause kill the pacing.
