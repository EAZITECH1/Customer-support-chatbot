# Submission — Walrus Sessions: Chatbots That Remember

| Field | Value |
|---|---|
| **Project** | **Walrus Dev Support** — Autonomous Developer Assistant chatbot on Walrus Memory |
| **System Prompt** | Production prompt: [`support-agent-prompt.md`](support-agent-prompt.md) (Template: [`support-agent-prompt.template.md`](support-agent-prompt.template.md)) |
| **MemWalAccount Object** | [`0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4`](https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4) (Sui Mainnet Shared Object) |
| **Delegate Account** | `0x3d67903dd4d875d2ebfbba47fed2d7eb09e927e6049374ce7ed522a085577610` |
| **Network** | Sui Mainnet / Walrus Mainnet |
| **MemWal Package** | `@mysten-incubation/memwal-mcp` (v0.0.7) |
| **LLM Model** | Google Gemini 2.5 Flash (via OpenRouter) |
| **Total Blobs on Walrus** | 15+ blobs committed across `support`, `open-tickets`, `product-intel` |
| **Telegram Bot (24/7)** | [@EazitechSupportBot](https://t.me/EazitechSupportBot) |
| **Web Application** | [https://eazitech-support.onrender.com](https://eazitech-support.onrender.com) |
| **Demo Video** | [Watch on YouTube (2m 15s Walkthrough)](https://youtu.be/V6wrIK1P5SI) |
| **Written Article** | [Published on Medium: How I Built a Self-Learning Developer Assistant on Walrus Memory](https://medium.com/@ajayiisrael523/how-i-built-a-self-learning-developer-assistant-on-walrus-memory-c6bcb9e08f7b) |
| **Repository** | [https://github.com/EAZITECH1/Customer-support-chatbot](https://github.com/EAZITECH1/Customer-support-chatbot) |

---

## What It Is

**Walrus Dev Support** is an autonomous, self-learning developer support assistant chatbot built specifically for the **Walrus and Sui ecosystem**. 

Unlike conventional support chatbots that suffer from session amnesia or lock developer intelligence inside proprietary SaaS databases, this chatbot turns every verified technical problem into an immutable, structured runbook owned by the ecosystem and stored on **Walrus**.

When a developer encounters an issue (such as Sui gas coin fragmentation during `walrus store` or empty `memwal_recall` query namespaces), the agent queries Walrus Memory (`memwal_recall`) before diagnosing. When the developer verifies the fix, it commits a structured post-mortem to Walrus on Sui Mainnet via `memwal_remember`.

Deployed 24/7 across two unified channels:
- **Web Portal** (`https://eazitech-support.onrender.com`): High-performance developer interface featuring real-time Server-Sent Events (SSE) memory inspection, ticker chips, and link code generation.
- **Telegram Bot** (`@EazitechSupportBot`): 24/7 long-polling mobile bot providing instant recall and cross-channel ticket sync.

---

## Submission Checklist

- [x] **Working Chatbot & Deployment**: Live 24/7 on Web ([eazitech-support.onrender.com](https://eazitech-support.onrender.com)) and Telegram ([@EazitechSupportBot](https://t.me/EazitechSupportBot))
- [x] **Walrus Memory Integration**: Direct stdio MCP client integration with `@mysten-incubation/memwal-mcp`
- [x] **Multi-Namespace Architecture**: `support` (canonical knowledge base), `open-tickets`, `customer-{id}`, `product-intel`
- [x] **On-Chain Mainnet Evidence**: 15+ blobs committed to Walrus Mainnet under account [`0xf6b75c6f…3175d4`](https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4)
- [x] **Full Copy-Pasteable Prompt & Template**: [`support-agent-prompt.md`](support-agent-prompt.md) and [`support-agent-prompt.template.md`](support-agent-prompt.template.md)
- [x] **Evidence of Real Use**: Screen recordings across Web and Telegram demonstrating real-world learning and recall ([YouTube Walkthrough](https://youtu.be/V6wrIK1P5SI))
- [x] **Written Article**: Published on Medium: [How I Built a Self-Learning Developer Assistant on Walrus Memory](https://medium.com/@ajayiisrael523/how-i-built-a-self-learning-developer-assistant-on-walrus-memory-c6bcb9e08f7b)
