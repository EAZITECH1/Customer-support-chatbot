# Submission — Walrus Sessions: Chatbots That Remember

| | |
|---|---|
| **Project** | EAZITECH Customer Support Chatbot — Decentralized Institutional Memory on Walrus |
| **System Prompt** | Production prompt — [support-agent-prompt.md](support-agent-prompt.md) (Template: [support-agent-prompt.template.md](support-agent-prompt.template.md)) |
| **Agent ID (delegate key)** | `21a5566e62214e85fdd9010d19b571bf8b6c897bd84472fe8b948766675a4c2a4` |
| **MemWalAccount Object** | [`0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4`](https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4) |
| **Agent Wallet** | `0x679d547b18cf9f2e77f1d33f932cbf4de5c63dda6a5c5d0e44caf7ae4334cd1b` |
| **Blobs on Mainnet** | ~12–14 raw blobs · 8 unique memories (resolved-video · product-intel · open-tickets) |
| **Network** | Sui Mainnet / Walrus Mainnet |
| **MemWal Package** | `0xe7c16fbea0560e7057e2bf7422feaa4fb313749fc69c9e9092fac7a33b81d7f5` |
| **Telegram Bot (24/7)** | [@EazitechSupportBot](https://t.me/EazitechSupportBot) |
| **Web Application** | [https://eazitech-support.onrender.com](https://eazitech-support.onrender.com) |
| **Demo Video** | [youtu.be/Ogv5r7-aKMo](https://youtu.be/Ogv5r7-aKMo) |
| **Upstream Issues Filed** | [MemWal#814](https://github.com/MystenLabs/MemWal/issues/814) · [#815](https://github.com/MystenLabs/MemWal/issues/815) · [#816](https://github.com/MystenLabs/MemWal/issues/816) |

---

## What It Is

An autonomous, decentralized customer support chatbot built for **EAZITECH** (a Web3 creator studio). Unlike conventional support bots that suffer from session amnesia or lock data inside proprietary SaaS vendors, this chatbot turns every resolved ticket into permanent, structured knowledge owned by the studio and stored immutably on **Walrus**.

When a customer reports an issue, the agent queries Walrus Memory (`memwal_recall`) across domain-specific namespaces (`resolved-video`, `resolved-billing`, etc.) before diagnosing. When an issue is resolved, it commits a structured, deduplicated post-mortem to Walrus on Sui Mainnet.

Deployed 24/7 across two seamless channels:
- **Telegram Bot** (`@EazitechSupportBot`): Always-on mobile channel for real-time client assistance.
- **Web Application** (`eazitech-support.onrender.com`): Editorial support portal featuring real-time SSE memory inspection.

---

## Submission Checklist

- [x] **Working Chatbot & Deployment**: Live 24/7 on Telegram ([@EazitechSupportBot](https://t.me/EazitechSupportBot)) and Web ([https://eazitech-support.onrender.com](https://eazitech-support.onrender.com))
- [x] **Walrus Memory Integration**: Direct stdio MCP client integration with `@mysten-incubation/memwal-mcp`
- [x] **Multi-Namespace Memory Architecture**: `resolved-{area}`, `open-tickets`, `customer-{id}`, `product-intel` with tier permissions
- [x] **On-Chain Mainnet Evidence**: 14 blobs committed to Walrus Mainnet under account [`0xf6b75c6f…3175d4`](https://suiscan.xyz/mainnet/object/0xf6b75c6fd44e685829e0baa04077c42c09bed658819e921126dc11ce8c3175d4) ([evidence/blobs.md](evidence/blobs.md))
- [x] **Full Copy-Pasteable Prompt & Template**: [support-agent-prompt.md](support-agent-prompt.md) and [support-agent-prompt.template.md](support-agent-prompt.template.md)
- [x] **Behavioral Calibration Matrix**: 8-point behavioral test suite, all verified ([evidence/findings.md](evidence/findings.md))
- [x] **Upstream Contributions to Mysten Labs**: Detailed issue reports [#814](https://github.com/MystenLabs/MemWal/issues/814), [#815](https://github.com/MystenLabs/MemWal/issues/815), [#816](https://github.com/MystenLabs/MemWal/issues/816)
- [x] **Demo Video**: [youtu.be/Ogv5r7-aKMo](https://youtu.be/Ogv5r7-aKMo)
- [x] **Technical Article**: Complete deep-dive article detailing architecture and findings

---

## Production Reliability & Relayer Handling

During early development, the managed relayer occasionally returned 429 (`ip_active_cap`) or 503 errors under heavy reconnections. We engineered the production deployment on Render to:
1. Maintain a single shared MCP child process between Express and Telegram, preventing connection-cap exhaustion.
2. Implement graceful background reconnection and exponential backoff.
3. Decouple memory availability from the web server boot so the frontend stays responsive even during transient relayer hiccups.
