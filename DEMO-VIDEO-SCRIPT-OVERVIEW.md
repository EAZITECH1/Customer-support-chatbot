# Demo Video Script — Walking the Overview Page

**What you're recording:** a scroll-through of the one-page overview artifact, narrated for judges.
**Length:** ~1:45 · **Page:** https://claude.ai/code/artifact/7022e37d-fca2-4c9d-bf3a-cbf76be375f1

This is the "read the submission" video. No live app needed — the page carries the story, and the on-chain links are your live proof. Good companion to the app demo; on its own it stands as the whole pitch.

---

## Before you record

- [ ] Open the artifact link in a full browser window, scrolled to the top
- [ ] Pick a theme that reads well on camera (the page follows your system light/dark — dark looks sharp for a recording)
- [ ] Have the Suiscan and Walruscan links ready to click live in beat 5 (that's the proof; don't skip it)
- [ ] Zoom the browser so the memory-ticker chips and the behavior grid are clearly legible

---

## The script

### 0:00 – 0:18 · Hero + the ticker

**On screen:** top of the page — "Support that remembers." and the memory-ticker strip.

**Say:**
> "This is a customer-support agent for EAZITECH, a Web3 creator studio. What makes it different is right here — every issue it resolves gets written to Walrus. This strip is the live memory ticker: it recalls a past resolution, then saves the new one to Walrus with a blob reference. The fix isn't in the chat log. It's on-chain, and the company owns it."

---

### 0:18 – 0:42 · How it works

**On screen:** scroll to the tool-loop diagram.

**Say:**
> "Under the hood, a local backend runs the model through the MemWal tool loop. The model decides when to recall, remember, analyze, or restore; the backend runs those against Walrus and feeds the results back, and it loops until the model has an answer. The agent runs on its own wallet, separate from mine, with the key held only in the backend."

---

### 0:42 – 1:08 · Verified behaviors

**On screen:** scroll to the 8-card grid.

**Say:**
> "It's tested against eight behaviors, all passing. I'll call out three. Cross-session memory — a fix from one conversation gets recalled in a separate session, which is the whole point. Memory as a hard dependency — if Walrus is unreachable, it refuses to answer from general knowledge instead of making something up. And tier scoping — a customer-facing context can't surface internal notes."

*(Let the grid sit on screen a beat so the other five are visible.)*

---

### 1:08 – 1:22 · Memory model

**On screen:** scroll to the namespaces table + tier tags.

**Say:**
> "Memory is organized into four namespaces — resolved fixes, open tickets, per-customer history, and product-wide patterns — with three tiers that each get their own read and write scope."

---

### 1:22 – 1:45 · Proof on mainnet (click it)

**On screen:** scroll to "Proof on mainnet." Click the **Suiscan** link — let the MemWalAccount object load in a new tab. Back, then click a **Walruscan** blob.

**Say:**
> "And it's all verifiable. This is the agent's memory account on Sui mainnet, and these are real memory blobs on Walrus — you can open them right now. The relayer that serves live recall is having an outage as I record this, but notice: the memories themselves are still here, on-chain, provable. That's the argument for putting them on Walrus — the data outlives the service."

**Close (over the footer):**
> "Built with Claude Code. The prompt's on GitHub. That's EAZITECH support — institutional memory the company keeps, on Walrus."

---

## Tips

- Click the on-chain links for real. A page that says "verifiable" is fine; a page where you *open the object on Suiscan mid-video* is proof.
- Don't read all eight behavior cards aloud — name a few, let the grid show the rest.
- The outage line is a strength here, not an apology. Say it plainly and move on.
