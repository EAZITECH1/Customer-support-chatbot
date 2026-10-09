# Walrus Dev Support: How We Built a Self-Learning Developer Assistant on Walrus Memory

*By Israel Ajayi (EAZITECH) — Built for the Walrus Sessions Hackathon: Chatbots That Remember (October 2026)*

---

## 1. The Amnesiac Support Problem in Developer Ecosystems

When developers build on emerging decentralized infrastructure like [Walrus](https://www.walrus.xyz/) and [Sui](https://sui.io/), they constantly bump into subtle, cutting-edge edge cases:
- *“Why does `walrus store` fail with `Insufficient gas coins` even though my wallet has 10 SUI?”*
- *“Why does `memwal_recall` return empty search results after memories were successfully saved?”*
- *“How do epochs and storage rebates calculate when storing 100MB+ blobs on testnet vs mainnet?”*

In fast-moving developer ecosystems, these critical solutions are discovered through painful trial and error in Discord threads, Telegram groups, and GitHub issues. Once a developer solves the problem, that knowledge remains siloed.

When projects deploy AI support agents to help developers, they hit the **Amnesiac Support Dilemma**:
1. **Zero Session Recall**: Standard LLM chatbots start with complete amnesia in every new session. They force every new developer through the exact same 15-minute diagnostic interrogation, asking for CLI versions, network environments, and log traces that were already solved yesterday.
2. **Vendor Lock-in of Institutional Knowledge**: Traditional AI memory frameworks store company knowledge in centralized vector databases or proprietary SaaS silos. If you ever want to switch models (e.g. from OpenAI to Gemini, Llama, or Qwen) or migrate hosting providers, your institutional intelligence is locked in someone else's database.
3. **Sovereign Memory**: We wanted an assistant where **the knowledge base is sovereign, decentralized, and lives directly on Walrus**. The LLM is simply an ephemeral compute layer; the memory belongs to the ecosystem on-chain.

To solve this, we built **Walrus Dev Support**—an autonomous developer assistant that learns verified technical fixes from real interactions, commits them permanently as decentralized blobs on Walrus, and recalls them instantly across Web and Telegram.

---

## 2. Core Architecture: The Walrus Memory Engine

Walrus Dev Support connects developers across two live interfaces—a responsive Web Portal and a 24/7 Telegram bot (`@EazitechSupportBot`)—unified by a decentralized Walrus Memory backend.

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
   │           - Multi-Channel Identity Linking (One-Time Link Codes)                          │
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

### Architectural Invariants:
1. **Recall Before Answering**: When a developer presents a technical error or symptom, the assistant *must* call `memwal_recall` against Walrus before generating prose. If a verified runbook exists, the agent serves the exact verified resolution with zero hallucination.
2. **Diagnostic Discipline**: If Walrus Memory returns no matching resolution, the agent does *not* fabricate speculative flags. It systematically collects diagnostic telemetry (CLI version, active environment, file size, stack traces).
3. **Structured Ingestion (`memwal_remember`)**: When a developer confirms a resolution worked, the agent converts the solution into an immutable structured JSON post-mortem and commits it to Walrus.
4. **Cross-Channel Identity & Knowledge Portability**: Memories stored on the Web Portal are immediately searchable on Telegram, and vice versa.

---

## 3. Before vs. After Walrus Memory: How Chatbot Behavior Transformed

A key requirement of building memory-enabled AI is proving that memory fundamentally transforms agent behavior rather than acting as a cosmetic add-on. Here is how our support bot behaves before and after integrating Walrus Memory:

| Capability | Before Walrus Memory (Stateless LLM) | After Walrus Memory (MemWal on Sui) |
| :--- | :--- | :--- |
| **Session Continuity** | **Total Amnesia.** Refreshing the page or starting a new session wiped all context. | **Persistent Institutional Knowledge.** Past resolutions are recalled across separate sessions and devices. |
| **Cross-Channel Parity** | **Siloed.** Web chat had no connection to Telegram (`@WalrusSupportBot`). | **Unified Sovereign Memory.** A solution confirmed on the Web is instantly recalled on Telegram. |
| **Handling Known Bugs** | **Repetitive Interrogation.** Asks every developer the same 5 diagnostic questions every single time. | **Instant Solution Delivery.** Identifies known symptoms and serves the verified runbook immediately in <2 seconds. |
| **Response Reliability** | **Hallucination Risk.** Synthesizes generic guesses or fake CLI flags when uncertain. | **Strict Grounding.** High-confidence answers backed by on-chain verified post-mortems (`recalled past resolutions`). |
| **Data Sovereignty** | **Vendor-Locked.** Memory locked in proprietary SaaS databases or third-party AI APIs. | **Decentralized & Portable.** Stored as immutable blobs on Walrus, owned by the project's own Sui wallet. |

---

## 4. Real-World Live Verification: The Screen Recordings

To demonstrate the memory lifecycle for the hackathon, we recorded two consecutive end-to-end sessions across Web and Telegram on October 9, 2026.

### 📹 Recording 1: The Web Portal (Teach the Agent)
* **Surface**: Web chat at `https://eazitech-support.onrender.com`
* **Account**: `ajayiisrael523@gmail.com`
* **Time**: `04:57 UTC`

#### Step 1: The First-Time Problem
A developer attempts to store a backup archive on Walrus and hits a common Sui gas coin issue:

> **Developer:**  
> *"I am trying to run `walrus store backup.tar.gz --epochs 5`, but the CLI fails with `Error: Insufficient gas coins to cover storage and gas fees`, even though my Sui wallet balance has 10 SUI. What is causing this?"*

#### Step 2: The Agent Recalls & Diagnoses
The Web UI instantly animates:
- `recalling past resolutions… · support`
- `recalled 5 past resolutions · support`

The assistant identifies that the developer's 10 SUI is fragmented across multiple small coins, whereas the Sui network requires a single coin large enough to cover the storage deposit plus execution budget. It provides the exact fix:

> **Assistant:**  
> *"To resolve this, you need to merge your smaller SUI coins into a larger one. You can do this using the Sui CLI:*  
> ```bash
> sui client gas merge-coins --primary-coin <YOUR_LARGEST_COIN_ID> --all
> ```  
> *(Replace `<YOUR_LARGEST_COIN_ID>` with the ID of one of your SUI coins. You can find your coin IDs by running `sui client gas`.)*  
> *After merging your gas coins, try running your `walrus store backup.tar.gz --epochs 5` command again. It should now execute successfully."*

#### Step 3: Verified & Committed to Walrus
The developer runs the command, verifies it works, and asks the bot to remember:

> **Developer:**  
> *"That worked! I merged my gas coins into a single coin using `sui client gas merge-coins`, and `walrus store backup.tar.gz --epochs 5` succeeded immediately and outputted the Blob ID! Thank you so much, please remember this verified fix on Walrus."*

The UI status indicator confirms:
- **`saved to Walrus ✓ · support`**

> **Assistant:**  
> *"Great! I'm glad that resolved your issue. I've recorded this verified solution in Walrus Memory for future reference. It's being saved now and should be fully stored shortly. This will help other developers who encounter the same gas coin fragmentation problem."*

---

### 📹 Recording 2: Telegram Bot (Instant Recall in a Fresh Session)
* **Surface**: Telegram Chat with `@WalrusSupportBot`
* **Time**: `05:03 UTC` (6 minutes later)

To prove true institutional memory, the developer opens Telegram, completely wipes the conversation session using `/reset`, and asks the question as a brand-new user with zero prior context.

#### Step 1: Clean Session Reset
> **Developer:** `/reset`  
> **Bot:** *"Ticket reset. Started a fresh support session."*

#### Step 2: The Amnesia Test
> **Developer:**  
> *"My walrus store command is failing with "Insufficient gas coins to cover storage and gas fees" even though I have enough SUI balance in my wallet. Is there a known fix for this?"*

#### Step 3: Instant Verified Recall
Instead of asking for CLI versions or coin breakdowns, the bot instantly retrieves the verified fix committed during the earlier web interaction:

> **Bot:**  
> *"This is a known issue related to how the Sui network handles gas coins. Even if you have enough total SUI balance, the `walrus store` command might fail if your SUI is fragmented into many small coins. The Sui network requires a single gas coin with a balance large enough to cover both the storage deposit and the transaction execution budget.*  
>  
> *The fix is to merge your smaller SUI coins into a larger one. You can do this using the `sui client gas merge-coins` command.*  
>  
> *For example, to merge all your available coins into a primary coin, you can use:*  
> ```bash
> sui client gas merge-coins --primary-coin <COIN_ID_1> --all
> ```  
> *Replace `<COIN_ID_1>` with the ID of one of your SUI coins. You can find your coin IDs by running `sui client gas`.*  
>  
> *After merging your gas coins, try the `walrus store` command again. This should resolve the "Insufficient gas coins" error."*

The assistant didn't guess. It didn't ask 5 follow-up questions. **It remembered.**

---

### Bonus Case: The MemWal Recall Namespace Fix (Recording 2 at 04:43)
In an earlier recorded exchange on Telegram, the developer asked about a Walrus Memory SDK issue:
> **Developer:** *"What's the known fix when MemWal recall returns empty after saving?"*  
> **Bot:** *"A common reason for this is not specifying the correct namespace when calling `memwal_recall`. Memories are stored within specific namespaces... Verified Fix: Ensure you are specifying the correct namespace in your `memwal_recall` call (e.g. `memwal_recall(query="...", namespace="my-app")`)."*

This confirmed that Walrus Dev Support accumulates solutions across multiple pillars of the ecosystem—from core Walrus storage daemons to the MemWal developer SDK.

---

## 5. On-Chain Telemetry & Proofs (Sui Mainnet)

Every memory transaction from our sessions is anchored directly to Sui and Walrus Mainnet:

- **Sui Mainnet MemWalAccount Object**:  
  [`0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4`](https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4)
- **Dedicated Agent Delegate Address**:  
  `0x3d67903dd4d875d2ebfbba47fed2d7eb09e927e6049374ce7ed522a085577610`
- **Total Memory Blobs Committed**:  
  **15+ Blobs** verified and inspectable on Walruscan.
- **Sample Verified Walruscan Blobs**:
  - [`vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA`](https://walruscan.com/mainnet/blob/vPVfOyZZd8U7MUW1IxX6aPBSxRdcBeLCwcbbz7CjUFA)
  - [`7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI`](https://walruscan.com/mainnet/blob/7Yxc8cjqpxmjS-GrVsFqFfPDNXo_mkazOLz451gASPI)

Because memories are stored as decentralized Walrus blobs, our assistant can reboot, redeploy, or switch LLM providers entirely without losing a single byte of developer intelligence.

---

## 6. Engineering Challenges & Lessons Learned

During the hackathon, building production-grade agentic memory exposed three critical technical challenges:

### 1. The Context Overflow Trap & Turn-Safe Pruning
When testing with open-weights models routed through provider gateways (such as DeepInfra), context limits can be strictly capped at 32k tokens. As agents accumulate multi-turn diagnostic history and memory recall search results, the transcript can breach the provider limit (`Requested input length exceeds maximum`).  
* **Our Solution**: We engineered a turn-safe sliding-window pruner (`pruneTranscript`). It analyzes message arrays by user turn pairs, dropping oldest turns while preserving strict OpenAI tool-call pairing invariants (never leaving orphaned tool responses). Combined with switching to **Google Gemini 2.5 Flash** (1M+ token context window), the system achieved sub-second latency with zero risk of context exhaustion.

### 2. Resilient Relayer SSE Reconnections
The MemWal MCP client communicates with `https://relayer.memory.walrus.xyz` over SSE. During idle chat periods, the relayer bridge occasionally closes idle connections (`bridge.sse_idle_closed`).  
* **Our Solution**: We implemented an automatic retry wrapper inside `memwal.call()`. If a tool call arrives during the 500ms bridge reconnection window, the client waits 800ms and retries cleanly, completely shielding the user and LLM from transient network blips.

### 3. Namespace Routing Strategy
The system prompt encourages the model to organize resolutions into topic partitions (`resolved-cli`, `resolved-memory`). However, to ensure all technical runbooks remain globally discoverable across the developer community, we normalized `resolved-*` namespaces onto the canonical `support` partition on Walrus, while maintaining strict customer isolation for `customer-{id}` and `open-tickets`.

---

## 7. Feedback for the Mysten Labs & Walrus Team

Building on `@mysten-incubation/memwal-mcp` (v0.0.7) was a fantastic experience. Based on our production deployment, we propose three suggestions for the SDK roadmap:

1. **Direct Blob ID in MCP Return Payload**:  
   `memwal_remember` returns text confirmation, but exposing the exact Walrus Blob ID (`blobId`) directly in the structured JSON tool result allows frontends to render clickable `walruscan.com/blob/{id}` verification badges instantly.
2. **Headless / Containerized Credential Injection**:  
   The current MCP server defaults to reading `~/.memwal/credentials.json`. For cloud environments (Render, AWS, Docker), having first-class support for `MEMWAL_PRIVATE_KEY` or `MEMWAL_CREDENTIALS_JSON` environment variables simplifies deployment pipelines.
3. **Namespace Listing / Inspection Tool**:  
   Adding a `memwal_list_namespaces` or count probe would enable AI agents to perform dynamic partition discovery without requiring hardcoded schema assumptions.

---

## 8. Try the Live Demo & Source Code

The full project is open-source and live:

- **Live Web Portal**: [https://eazitech-support.onrender.com](https://eazitech-support.onrender.com)
- **Live 24/7 Telegram Bot**: [@EazitechSupportBot](https://t.me/EazitechSupportBot)
- **GitHub Repository**: [https://github.com/EAZITECH1/Customer-support-chatbot](https://github.com/EAZITECH1/Customer-support-chatbot)
- **Studio Website**: [https://eazitech.xyz](https://eazitech.xyz)
- **Screen Recording Demos**: Tested live on October 9, 2026.

With Walrus Memory, AI agents no longer suffer from amnesia. They become permanent, decentralized knowledge engines that make developer communities smarter with every ticket they solve.
