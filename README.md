# EAZITΞCH — Decentralized Institutional Memory Customer Support Chatbot

> **Built for "Walrus Sessions: Chatbots That Remember" (Sep 18 – Oct 9, 2026)**
>
> A production-ready, decentralized customer support chatbot powered by **Walrus Memory (MemWal MCP)** and an OpenAI-compatible LLM. Delivered as both a **24/7 Telegram Bot** and a **Web UI** styled after [eazitech.xyz](https://eazitech.xyz/).

---

## The Problem: The Amnesiac Support Bot

Most AI customer support bots across companies suffer from severe session amnesia:
1. When a client encounters an obscure technical error, cloud pipeline issue, or account dispute, the support bot starts from zero every time.
2. Fixes found by senior engineers evaporate when the ticket closes, forcing repeated troubleshooting.
3. Proprietary memory features lock knowledge into closed SaaS silos (e.g. OpenAI Assistants API), meaning switching LLM providers wipes company institutional memory clean.

## The Solution: Sovereign Memory on Walrus

This system provides **companies and tech enterprises** with an immutable, portable institutional memory layer powered by **Walrus decentralized blob storage** via the **MemWal MCP** server:
- **Recall Before Answering**: Queries past resolutions (`resolved-{area}`) before deriving fixes from general knowledge.
- **Store Verified Resolutions**: When an incident is solved, it commits a structured, de-duplicated post-mortem directly to Walrus.
- **Cross-Channel Continuity**: The same Walrus memory bank powers both the web dashboard and the Telegram bot (`@EazitechSupportBot`).
- **Vendor-Agnostic Sovereignty**: Switch from Claude to Qwen, Llama, or GPT-4o without losing a single customer ticket or company resolution.

---

## Live Deployments & Demo

- **Telegram Bot (24/7)**: [@EazitechSupportBot](https://t.me/EazitechSupportBot)
- **Web App**: Single-page support portal with real-time SSE stream of agent reasoning & MemWal tool calls.
- **Public GitHub**: [EAZITECH1/Customer-support-chatbot](https://github.com/EAZITECH1/Customer-support-chatbot)

---

## On-Chain Evidence (Sui & Walrus Mainnet)

The customer support chatbot writes memories to Walrus on **Sui Mainnet**:

- **MemWalAccount Object**: [`0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4`](https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4) (Sui Mainnet Shared Object)
- **Delegate Account**: `0x3d67903dd4d875d2ebfbba47fed2d7eb09e927e6049374ce7ed522a085577610`
- **Sample Stored Memories on Walruscan**:
  - [`vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA`](https://walruscan.com/mainnet/blob/vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA) — `product-intel` recurring pattern
  - [`7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI`](https://walruscan.com/mainnet/blob/7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI) — `open-tickets` escalation
  - [`mZ9kG_4p4kP3q3B6N5H_6mKx...`](https://walruscan.com/mainnet/blob/mZ9kG_4p4kP3q3B6N5H_6mKx) — `resolved-video` 720p/1080p export fix

---

## Architecture

```
   ┌────────────────────────────────┐       ┌────────────────────────────────┐
   │    Web UI (Browser SSE)        │       │   Telegram (@EazitechSupportBot)│
   └───────────────┬────────────────┘       └───────────────┬────────────────┘
                   │ POST /api/chat                         │ Long Polling
                   ▼                                        ▼
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                     Express & Telegram Orchestrator                     │
   │                           (server/index.js)                             │
   └───────────────────────────────────┬─────────────────────────────────────┘
                                       │ System Prompt + Context
                                       ▼
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                       OpenAI-Compatible LLM Client                      │
   │                          (Groq / OpenRouter / Ollama)                   │
   └───────────────────────────────────┬─────────────────────────────────────┘
                                       │ Emits Tool Calls
                                       ▼
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                     MemWal MCP Client (Stdio Process)                   │
   │                                                                         │
   │   memwal_health | memwal_recall | memwal_remember | memwal_analyze       │
   └───────────────────────────────────┬─────────────────────────────────────┘
                                       │ Writes / Reads
                                       ▼
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                   Walrus Decentralized Blob Storage                     │
   │                             (Mainnet)                                   │
   └─────────────────────────────────────────────────────────────────────────┘
```

### Namespace Partitioning

| Namespace | Scope & Purpose | Access Tier |
|---|---|---|
| `resolved-{area}` | Verified, reusable solutions (e.g. `resolved-video`, `resolved-billing`). The durable institutional knowledge base. | Tier 1, 2, Lead |
| `open-tickets` | Active troubleshooting context for handoffs between shifts or escalation tiers. | Tier 2, Lead |
| `customer-{id}` | Scoped per-client preferences, asset specifications, and ongoing project history. | Context-isolated |
| `product-intel` | Systemic patterns, recurring bugs, and software pipeline quirks fed to engineering. | Lead |

---

## Behavioral Calibration Matrix

The prompt and tool loop were tested against an 8-point behavioral test:

| # | Behavioral Invariant | Target Behavior | Result |
|---|---|---|---|
| 1 | **Recall First** | Recalls prior fixes before suggesting unverified workarounds | **PASS** |
| 2 | **Silent Ingestion** | Writes structured memory without narrating backend storage to user | **PASS** |
| 3 | **Cross-Session Recall** | Recalls a stored fix across different sessions and channels (Web/Telegram) | **PASS** |
| 4 | **Deduplication** | Reuses an existing resolution instead of writing duplicate blobs | **PASS** |
| 5 | **Structured Escalation**| Writes active state to `open-tickets` when escalating | **PASS** |
| 6 | **Privacy Preservation** | Strips API keys, passwords, and PII before writing to Walrus | **PASS** |
| 7 | **Graceful Degradation** | Informs user honestly if memory is offline rather than hallucinating | **PASS** |
| 8 | **Tier Isolation** | Prevents internal engineering/ticket notes from leaking to customers | **PASS** |

---

## Local Setup

### 1. Prerequisites
- Node.js >= 18
- An OpenAI-compatible API endpoint (Groq, OpenRouter, Together, or local Ollama)
- A Sui wallet for Walrus Memory

### 2. Installation
```bash
git clone https://github.com/EAZITECH1/Customer-support-chatbot.git
cd Customer-support-chatbot
npm install
cp .env.example .env
```

### 3. Environment Variables (`.env`)
Fill in your `.env`:
```env
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_API_KEY=your_llm_api_key
LLM_MODEL=llama-3.3-70b-versatile
TELEGRAM_BOT_TOKEN=your_telegram_bot_token  # optional
```

### 4. Authorize Walrus Memory
Run the interactive one-time login tool:
```bash
npm run memwal:login
```
Connect your Sui wallet in the browser popup and approve the delegate key. The command automatically captures `MEMWAL_CREDENTIALS_JSON` into `.env` without modifying your system's global `~/.memwal`.

### 5. Start the Server & Bot
```bash
npm start
```
- Open **http://localhost:8787** for the web interface.
- Open Telegram and message your bot (if `TELEGRAM_BOT_TOKEN` is set).

---

## 24/7 Cloud Deployment (Render)

This project can be deployed to Render's free Web Service tier in under 3 minutes:

1. Push your code to your GitHub repo.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Web Service**.
3. Connect your repository.
4. Set:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add the following **Environment Variables**:
   - `LLM_BASE_URL`
   - `LLM_API_KEY`
   - `LLM_MODEL`
   - `MEMWAL_CREDENTIALS_JSON`
   - `TELEGRAM_BOT_TOKEN`
6. Click **Deploy**. Both the Web App and Telegram Bot will run 24/7!

---

## Project Structure

```
├── public/                 # Warm editorial Web UI matching eazitech.xyz
│   ├── index.html
│   ├── app.js
│   └── style.css
├── server/
│   ├── index.js            # Express server & SSE event stream
│   ├── telegram.js         # Telegram bot interface (polling + tool loop)
│   ├── memwal.js           # Stdio MCP client for @mysten-incubation/memwal-mcp
│   ├── llm.js              # Fetch-based OpenAI-compatible LLM client
│   ├── credentials.js      # Materializes base64 wallet JSON into isolated HOME
│   ├── store.js            # Local session transcript persistence
│   ├── memwal-login.js     # CLI helper for one-time Sui wallet authorization
│   └── smoke-memwal.js     # Direct Walrus write/read verification script
├── support-bot-prompt.md   # Live production system prompt
├── support-bot-prompt.template.md # Generic template for other Web3 teams
├── package.json
└── README.md
```

---

## Upstream Feedback to Mysten Labs / MemWal

Issues and developer experience improvements identified during this build:
- **Issue #814**: `memwal_remember` reports failure on a relayer 503/timeout even when the blob persists on Walrus, causing agent loops to retry and create duplicate blobs.
- **Issue #815**: No API method to enumerate memories within a specific namespace or retrieve a memory's blob ID directly from the MCP tool result.
- **Issue #816**: Credential path defaults strictly to `~/.memwal`, requiring isolated HOME directory redirection for dedicated daemon wallets.

---

## License

MIT © [EAZITECH](https://eazitech.xyz)
