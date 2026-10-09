# 🎬 Demo Video Production Script & ElevenLabs Voiceover
**Project:** Walrus Dev Support — Autonomous Developer Assistant chatbot on Walrus Memory  
**Event:** Walrus Sessions Hackathon: Chatbots That Remember  
**YouTube Video:** [https://youtu.be/V6wrIK1P5SI](https://youtu.be/V6wrIK1P5SI)  
**Video Sequence:** 1. Web Chat (First) → 2. Telegram UI (Second) → 3. GitHub Repo Scroll Through (Last)  
**Estimated Runtime:** ~2 Minutes 15 Seconds (approx. 330 words)  

---

## 🎙️ ElevenLabs Recommended Generation Settings
* **Model:** `Eleven Multilingual v2` or `Eleven Turbo v2.5`
* **Voice Suggestions:** `Adam` (Deep, crisp narration), `Brian` (Articulate, technical), or `George` (Warm, authoritative)
* **Voice Settings:**
  * **Stability:** `50%` (Natural inflections and conversational pacing)
  * **Clarity + Similarity:** `75% - 80%`
  * **Style Exaggeration:** `0% - 10%`
  * **Speaker Boost:** `ON`

---

## 📋 Full Production Script (Visuals + Audio Cues)

---

### SCENE 1: Web Chat Interface (0:00 – 0:50)
*Order: First*

| Timestamp | Visual Action On Screen | ElevenLabs Voiceover (Audio) |
|---|---|---|
| **0:00 – 0:12** | • Show Web Portal landing at `eazitech-support.onrender.com`.<br>• Cursor hovers over **"WALRUS DEV SUPPORT"** and the green indicator **"MEMORY ONLINE"**. | *"Hi everyone. I’m Israel from EAZITECH, and this is Walrus Dev Support... an autonomous developer assistant chatbot built on Walrus Memory for the Walrus Sessions Hackathon."* |
| **0:12 – 0:24** | • Zoom in on chat window.<br>• User types and sends real issue prompt: `walrus store backup.tar.gz --epochs 5` failing with `Error: Insufficient gas coins to cover storage and gas fees`. | *"Developers building on decentralized storage frequently encounter bleeding-edge hurdles. Here on our web portal, a developer runs into an issue where storing a backup file fails with 'Insufficient gas coins', even though their wallet holds ten SUI."* |
| **0:24 – 0:38** | • Highlight green animated status badge below input box: `recalling past resolutions… · support` → `recalled 5 past resolutions · support`.<br>• Bot renders diagnosis explaining Sui coin fragmentation and outputs `sui client gas merge-coins`. | *"Before answering, the chatbot calls MemWal recall against Walrus Memory. It recognizes that Sui requires a single consolidated gas coin, and immediately serves the exact diagnostic fix: merging smaller coins using the Sui CLI."* |
| **0:38 – 0:50** | • Developer types: *"That worked! Outputted Blob ID. Please remember this fix on Walrus."*<br>• Status badge confirms: **`saved to Walrus ✓ · support`**. | *"The developer runs the merge, verifies the blob upload succeeds, and asks the assistant to remember the solution. Instantly, the verified fix is committed as an immutable structured memory directly to Walrus on Sui Mainnet."* |

---

### SCENE 2: Telegram Mobile UI (0:50 – 1:35)
*Order: Second*

| Timestamp | Visual Action On Screen | ElevenLabs Voiceover (Audio) |
|---|---|---|
| **0:50 – 1:04** | • Switch screen recording to the Telegram app.<br>• Chat with `@EazitechSupportBot` (`@WalrusSupportBot`).<br>• Developer types `/reset`.<br>• Bot responds: *"Ticket reset. Started a fresh support session."* | *"Now, let's switch to our twenty-four-seven Telegram bot. To prove there is zero local caching or amnesia, we send a reset command to wipe all session history and simulate a completely fresh developer interaction."* |
| **1:04 – 1:20** | • Developer types identical question: *"My walrus store command is failing with Insufficient gas coins even though I have enough SUI. Is there a known fix for this?"*<br>• Hit send. | *"Now, imagine another developer arrives minutes later from their phone and hits the exact same gas coin error without any prior context."* |
| **1:20 – 1:35** | • Show Telegram response arriving in **under 2 seconds** with the verified `merge-coins` runbook.<br>• Highlight zero back-and-forth questioning. | *"Look at that speed. In under two seconds, the assistant queries Walrus Memory and delivers the exact verified runbook learned earlier on the web. It didn't hallucinate, and it didn't ask repetitive diagnostic questions. It remembered across separate sessions and platforms."* |

---

### SCENE 3: GitHub Repository Scroll Through (1:35 – 2:15)
*Order: Last*

| Timestamp | Visual Action On Screen | ElevenLabs Voiceover (Audio) |
|---|---|---|
| **1:35 – 1:48** | • Switch browser to `github.com/EAZITECH1/Customer-support-chatbot`.<br>• Scroll through header, badges, and the live deployment links (Web app, Telegram bot, published Medium article). | *"Everything you see is completely open-source. On our public GitHub repository, you will find the complete architecture orchestrating our Express server, Telegram runtime, and Walrus Memory."* |
| **1:48 – 2:02** | • Scroll through Architecture section.<br>• Highlight `server/memwal.js` (MCP client for `@mysten-incubation/memwal-mcp`), Google Gemini 2.5 Flash via OpenRouter, and the Sui Mainnet MemWalAccount shared object. | *"The core is powered by Google Gemini 2.5 Flash paired with the MemWal Model Context Protocol client. We implemented automatic relayer reconnection and turn-safe sliding-window pruning to ensure rock-solid production stability."* |
| **2:02 – 2:15** | • Scroll to `support-agent-prompt.md` and the Medium article link.<br>• Show closing banner with studio link `eazitech.xyz`. | *"By turning developer solutions into sovereign, decentralized memories on Walrus, AI agents no longer start from zero. Every solved bug makes the entire ecosystem permanently smarter. Thank you for watching!"* |

---

## 🗣️ Copy-Paste Ready ElevenLabs Voiceover Blocks

*Instructions: You can copy and paste the text blocks below directly into ElevenLabs text generation box.*

### Full Voiceover Text (Single Take — ~2 min 15 sec)

```text
Hi everyone. I’m Israel from EAZITECH, and this is Walrus Dev Support... an autonomous developer assistant chatbot built on Walrus Memory for the Walrus Sessions Hackathon.

Developers building on decentralized storage frequently encounter bleeding-edge hurdles. Here on our web portal, a developer runs into an issue where storing a backup file fails with 'Insufficient gas coins', even though their wallet holds ten SUI.

Before answering, the chatbot calls MemWal recall against Walrus Memory. It recognizes that Sui requires a single consolidated gas coin, and immediately serves the exact diagnostic fix: merging smaller coins using the Sui CLI.

The developer runs the merge, verifies the blob upload succeeds, and asks the assistant to remember the solution. Instantly, the verified fix is committed as an immutable structured memory directly to Walrus on Sui Mainnet.

Now, let's switch to our twenty-four-seven Telegram bot. To prove there is zero local caching or amnesia, we send a reset command to wipe all session history and simulate a completely fresh developer interaction.

Now, imagine another developer arrives minutes later from their phone and hits the exact same gas coin error without any prior context.

Look at that speed. In under two seconds, the assistant queries Walrus Memory and delivers the exact verified runbook learned earlier on the web. It didn't hallucinate, and it didn't ask repetitive diagnostic questions. It remembered across separate sessions and platforms.

Everything you see is completely open-source. On our public GitHub repository, you will find the complete architecture orchestrating our Express server, Telegram runtime, and Walrus Memory.

The core is powered by Google Gemini 2.5 Flash paired with the MemWal Model Context Protocol client. We implemented automatic relayer reconnection and turn-safe sliding-window pruning to ensure rock-solid production stability.

By turning developer solutions into sovereign, decentralized memories on Walrus, AI agents no longer start from zero. Every solved bug makes the entire ecosystem permanently smarter. Thank you for watching!
```

---

### Segmented Blocks (If Generating Audio Clip-by-Clip in ElevenLabs)

#### Clip 1: Web Chat (First)
```text
Hi everyone. I’m Israel from EAZITECH, and this is Walrus Dev Support... an autonomous developer assistant chatbot built on Walrus Memory for the Walrus Sessions Hackathon.

Developers building on decentralized storage frequently encounter bleeding-edge hurdles. Here on our web portal, a developer runs into an issue where storing a backup file fails with 'Insufficient gas coins', even though their wallet holds ten SUI.

Before answering, the chatbot calls MemWal recall against Walrus Memory. It recognizes that Sui requires a single consolidated gas coin, and immediately serves the exact diagnostic fix: merging smaller coins using the Sui CLI.

The developer runs the merge, verifies the blob upload succeeds, and asks the assistant to remember the solution. Instantly, the verified fix is committed as an immutable structured memory directly to Walrus on Sui Mainnet.
```

#### Clip 2: Telegram UI (Second)
```text
Now, let's switch to our twenty-four-seven Telegram bot. To prove there is zero local caching or amnesia, we send a reset command to wipe all session history and simulate a completely fresh developer interaction.

Now, imagine another developer arrives minutes later from their phone and hits the exact same gas coin error without any prior context.

Look at that speed. In under two seconds, the assistant queries Walrus Memory and delivers the exact verified runbook learned earlier on the web. It didn't hallucinate, and it didn't ask repetitive diagnostic questions. It remembered across separate sessions and platforms.
```

#### Clip 3: GitHub Repo Scroll Through (Last)
```text
Everything you see is completely open-source. On our public GitHub repository, you will find the complete architecture orchestrating our Express server, Telegram runtime, and Walrus Memory.

The core is powered by Google Gemini 2.5 Flash paired with the MemWal Model Context Protocol client. We implemented automatic relayer reconnection and turn-safe sliding-window pruning to ensure rock-solid production stability.

By turning developer solutions into sovereign, decentralized memories on Walrus, AI agents no longer start from zero. Every solved bug makes the entire ecosystem permanently smarter. Thank you for watching!
```
