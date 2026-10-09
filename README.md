# Walrus Dev Support — Autonomous Developer Assistant chatbot on Walrus Memory

> **Built for "Walrus Sessions: Chatbots That Remember" (Hackathon Submission — October 2026)**  
> An autonomous, self-learning developer support assistant chatbot for the **Walrus & Sui ecosystem**, powered by **Walrus Memory (MemWal MCP)** on **Sui Mainnet** and **Google Gemini 2.5 Flash**.  
> Delivered across two unified surfaces: a high-performance **Web Portal** and a **24/7 Telegram Bot** ([@WalrusSupportBot](https://t.me/EazitechSupportBot)).

---

## 1. The Problem: The Amnesiac Developer Support Bot

When developers build on emerging decentralized infrastructure like Walrus and Sui, they constantly encounter subtle, cutting-edge edge cases:
- *“Why does `walrus store` fail with `Insufficient gas coins` even though my wallet has 10 SUI?”*
- *“Why does `memwal_recall` return empty search results after memories were successfully saved?”*
- *“How do storage epochs and rebates work when persisting large blobs on testnet vs mainnet?”*

Traditional AI support chatbots suffer from **complete session amnesia**:
1. **Repetitive Interrogations**: Every new conversation starts from a blank slate. The bot asks every developer the same five diagnostic questions over and over for issues solved yesterday.
2. **Knowledge Silos**: When developers find verified workarounds in private chats or GitHub issues, that knowledge remains fragmented and lost to the broader community.
3. **Vendor Lock-in**: Centralized memory solutions lock intelligence inside proprietary SaaS databases or third-party AI APIs. If you switch models or hosting providers, your developer knowledge base is lost.

---

## 2. The Solution: Sovereign Memory on Walrus

**Walrus Dev Support** transforms how developer ecosystems retain and share knowledge by using **Walrus decentralized blob storage** via the **MemWal MCP** protocol:

- **Recall Before Answering (`memwal_recall`)**: The assistant chatbot searches past verified technical runbooks on Walrus before attempting to synthesize speculative code.
- **Structured Ingestion (`memwal_remember`)**: When an issue is confirmed resolved by a developer, the assistant chatbot converts the fix into an immutable structured post-mortem and commits it directly to Sui Mainnet.
- **Cross-Channel Parity**: A solution learned on the Web Portal is instantly searchable on Telegram, and vice versa.
- **Sovereign & Decentralized**: The knowledge base is anchored as decentralized blobs on Walrus, owned by the project's own Sui wallet. Models can be swapped on the fly with zero memory loss.

---

## 3. The 5 Ecosystem Pillars Supported

Walrus Dev Support is an autonomous developer support chatbot strictly grounded across all five official documentation pillars:

| Pillar | Focus Areas & Diagnostics |
| :--- | :--- |
| **1. Walrus Core Storage & CLI** | `walrus store`, `walrus read`, `walrus blob-status`, storage epochs, Sui gas coin fragmentation (`sui client gas merge-coins`), RPC consensus, and daemon health checks (`walrus health`). |
| **2. Walrus Memory (MemWal)** | `@mysten-incubation/memwal-mcp`, `memwal_recall`, `memwal_remember`, namespace partitioning, Seal encryption sessions, relayer bridge handling. |
| **3. Walrus Console** | Web dashboard operations, storage usage monitoring, bucket provisioning, and identity link code pairing (`WAL-XXXX`). |
| **4. Walrus Skills** | Autonomous coding agent skills CLI, automated repository workflows, and terminal toolchains. |
| **5. Walrus Oyster API** | S3-compatible REST API, AWS SDK migrations, `PutObject` payload limits, and multi-part upload workarounds. |

---

## 4. Live Deployments

- **Live Web Portal**: [https://eazitech-support.onrender.com](https://eazitech-support.onrender.com)
- **Live 24/7 Telegram Bot**: [@EazitechSupportBot](https://t.me/EazitechSupportBot)
- **Public GitHub Repository**: [EAZITECH1/Customer-support-chatbot](https://github.com/EAZITECH1/Customer-support-chatbot)
- **Published Article (Medium)**: [How I Built a Self-Learning Developer Assistant on Walrus Memory](https://medium.com/@ajayiisrael523/how-i-built-a-self-learning-developer-assistant-on-walrus-memory-c6bcb9e08f7b)

---

## 5. Before vs. After Walrus Memory

| Capability | Before Walrus Memory (Stateless LLM) | After Walrus Memory (MemWal on Sui) |
| :--- | :--- | :--- |
| **Session Continuity** | **Total Amnesia.** Refreshing the page or starting a new session wiped all context. | **Persistent Institutional Knowledge.** Past resolutions are recalled across separate sessions and devices. |
| **Cross-Channel Parity** | **Siloed.** Web chat had no connection to Telegram (`@WalrusSupportBot`). | **Unified Sovereign Memory.** A solution confirmed on the Web is instantly recalled on Telegram. |
| **Handling Known Bugs** | **Repetitive Interrogation.** Asks every developer the same 5 diagnostic questions every single time. | **Instant Solution Delivery.** Identifies known symptoms and serves the verified runbook immediately in <2 seconds. |
| **Response Reliability** | **Hallucination Risk.** Synthesizes generic guesses or fake CLI flags when uncertain. | **Strict Grounding.** High-confidence answers backed by on-chain verified post-mortems (`recalled past resolutions`). |
| **Data Sovereignty** | **Vendor-Locked.** Memory locked in proprietary SaaS databases or third-party AI APIs. | **Decentralized & Portable.** Stored as immutable blobs on Walrus, owned by the project's own Sui wallet. |

---

## 6. Live Verification: Real Screen Recording Case Studies

The live memory lifecycle was recorded end-to-end on October 9, 2026:

### Case 1: Teaching the Agent on Web (The Gas-Coin Merge Fix)
* **Surface**: Web Portal (`eazitech-support.onrender.com`) at `04:57 UTC`
* **Prompt**:
  > *"I am trying to run `walrus store backup.tar.gz --epochs 5`, but the CLI fails with `Error: Insufficient gas coins to cover storage and gas fees`, even though my Sui wallet balance has 10 SUI. What is causing this?"*
* **What Happened**:
  1. Assistant chatbot queries `memwal_recall` on Walrus (`recalling past resolutions… · support`).
  2. Diagnoses that 10 SUI is fragmented into small coins; Sui requires a single coin large enough to cover the storage deposit + execution budget.
  3. Provides the fix: `sui client gas merge-coins --primary-coin <YOUR_LARGEST_COIN_ID> --all`.
  4. Developer confirms the command succeeded, and requests to remember it.
  5. UI confirms: **`saved to Walrus ✓ · support`**. Solution is committed as an immutable blob to Sui Mainnet.

### Case 2: Instant Recall on Telegram (Fresh Session After `/reset`)
* **Surface**: Telegram Bot (`@WalrusSupportBot`) at `05:03 UTC` (6 minutes later)
* **Prompt**: Developer sends `/reset` to completely wipe conversation state, then asks:
  > *"My walrus store command is failing with "Insufficient gas coins to cover storage and gas fees" even though I have enough SUI balance in my wallet. Is there a known fix for this?"*
* **What Happened**:
  - The bot immediately calls `memwal_recall` on Walrus.
  - In **under 2 seconds**, it outputs the verified runbook learned earlier on the Web Portal without asking any diagnostic questions.

---

## 7. System Architecture

```
   ┌─────────────────────────────────────────┐       ┌─────────────────────────────────────────┐
   │       Web Portal (SSE / Real-Time)      │       │     Telegram (@EazitechSupportBot)      │
   │      eazitech-support.onrender.com      │       │          24/7 Long-Polling Bot          │
   └────────────────────┬────────────────────┘       └────────────────────┬────────────────────┘
                        │ POST /api/chat                                  │ Updates
                        ▼                                                 ▼
   ┌───────────────────────────────────────────────────────────────────────────────────────────┐
   │                         Express & Telegram Runtime Orchestrator                           │
   │           - Session Management & Token-Budget Sliding Window Pruning                      │
   │           - Multi-Channel Identity Linking (One-Time Link Codes WAL-XXXX)                 │
   │           - Resilient Tool Parsing & SSE Status Streaming                                 │
   └─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                                 │ System Prompt + Context
                                                 ▼
   ┌───────────────────────────────────────────────────────────────────────────────────────────┐
   │                                LLM Reasoning Layer                                        │
   │                           Google Gemini 2.5 Flash via OpenRouter                          │
   │                   (Sub-second latency, 1M+ token context, native tool use)                │
   └─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                                 │ stdio JSON-RPC
                                                 ▼
   ┌───────────────────────────────────────────────────────────────────────────────────────────┐
   │                         MemWal MCP Client (Stdio Child Process)                           │
   │                         @mysten-incubation/memwal-mcp (v0.0.7)                            │
   │                                                                                           │
   │     memwal_health   │   memwal_recall   │   memwal_remember   │   memwal_analyze          │
   └─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                                 │ Authenticated Relayer Bridge
                                                 ▼
   ┌───────────────────────────────────────────────────────────────────────────────────────────┐
   │                           Walrus Decentralized Blob Storage                               │
   │                          Sui Mainnet (MemWalAccount Object)                               │
   └───────────────────────────────────────────────────────────────────────────────────────────┘
```

### Namespace Partitioning Strategy

| Namespace | Scope & Purpose | Access Tier |
| :--- | :--- | :--- |
| `support` / `resolved-*` | Canonical developer knowledge base on Walrus. Verified, de-duplicated post-mortems across CLI, SDK, and APIs. | Public / Global |
| `open-tickets` | Live investigation state for unresolved issues or escalations. Shared working state between Web and Telegram. | Tier 2, Lead |
| `customer-{id}` | Scoped developer profile, active environment, and linked channel identities. | Context-isolated |
| `product-intel` | Recurring platform quirks, protocol regressions, and vendor issues aggregated for engineering review. | Lead |

---

## 8. On-Chain Telemetry & Proofs (Sui Mainnet)

Every memory transaction is anchored directly to **Sui Mainnet** and inspectable on **Walruscan**:

- **MemWalAccount Object ID**: [`0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4`](https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4) (Sui Mainnet Shared Object)
- **Agent Delegate Account**: `0x3d67903dd4d875d2ebfbba47fed2d7eb09e927e6049374ce7ed522a085577610`
- **Total Blobs Committed**: **15+ Blobs** verified and inspectable on Walruscan.
- **Sample Verified Blobs**:
  - [`vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA`](https://walruscan.com/mainnet/blob/vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA) — `product-intel` recurring pattern
  - [`7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI`](https://walruscan.com/mainnet/blob/7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI) — `open-tickets` escalation state

---

## 9. Engineering Innovations

During development, we resolved three critical challenges to achieve production-grade reliability:

1. **Context Window Protection (`pruneTranscript`)**:  
   Open-weights gateways often enforce strict 32k context caps. We engineered a turn-safe sliding-window pruner that drops oldest turns while preserving OpenAI tool-call pairing invariants (never leaving orphaned tool responses). Combined with **Google Gemini 2.5 Flash** (1M+ context window), context overflow is eliminated.
2. **Resilient SSE Reconnection**:  
   MemWal MCP communicates with the relayer over SSE, which occasionally closes idle connections (`bridge.sse_idle_closed`). We added an automatic 800ms retry wrapper in `memwal.call()` to absorb momentary reconnects seamlessly.
3. **Cross-Channel Identity Linking**:  
   Developers can generate a one-time link code (`WAL-XXXX`) on the Web Portal and redeem it on Telegram with `/link WAL-XXXX`, instantly linking tickets and history across platforms.

---

## 10. Local Setup & Deployment

### 1. Prerequisites
- Node.js >= 18
- An OpenAI-compatible API endpoint (OpenRouter, Google, Groq, or local Ollama)
- A Sui wallet authorized for Walrus Memory

### 2. Installation
```bash
git clone https://github.com/EAZITECH1/Customer-support-chatbot.git
cd Customer-support-chatbot
npm install
cp .env.example .env
```

### 3. Environment Variables (`.env`)
```env
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_API_KEY=your_openrouter_or_llm_api_key
LLM_MODEL=google/gemini-2.5-flash
TELEGRAM_BOT_TOKEN=your_telegram_bot_token  # optional
MEMWAL_NAMESPACE=support
```

### 4. Authorize Walrus Memory
Run the interactive one-time login tool:
```bash
npm run memwal:login
```
Approve the delegate key in the browser popup. It captures `MEMWAL_CREDENTIALS_JSON` into `.env` without modifying your global `~/.memwal`.

### 5. Start the Server & Bot
```bash
npm start
```
- Web Portal: `http://localhost:8787`
- Telegram: Message your bot directly if `TELEGRAM_BOT_TOKEN` is configured.

---

## 11. Project Structure

```
├── public/                 # Real-time Web Portal (SSE stream + ticker)
│   ├── index.html
│   ├── app.js              # Streaming client, auto-resize, identity linking
│   └── style.css           # Editorial typography & responsive layout
├── server/
│   ├── index.js            # Express server, SSE chat endpoint & memory tools
│   ├── telegram.js         # Telegram bot long-polling & tool execution loop
│   ├── memwal.js           # Stdio MCP client for @mysten-incubation/memwal-mcp
│   ├── llm.js              # Fetch-based OpenAI-compatible completion client
│   ├── credentials.js      # Materializes base64 credentials into isolated HOME
│   ├── link.js             # One-time link code manager (WAL-XXXX)
│   ├── store.js            # Session transcript persistence & pruneTranscript
│   ├── memwal-login.js     # CLI helper for one-time Sui wallet authorization
│   └── smoke-memwal.js     # Direct Walrus write/read verification script
├── support-agent-prompt.md # Production system prompt (5 ecosystem pillars)
├── article.html            # Complete Medium / Inkray publication article
├── package.json
└── README.md
```

---

## 12. License

MIT © [Israel Ajayi (EAZITECH)](https://eazitech.xyz)
