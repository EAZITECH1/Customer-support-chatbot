// server/store.js
// Per-session chat history, kept in memory and mirrored to a local JSON file so
// a server restart during a demo doesn't wipe the conversation.
//
// This is SESSION PLUMBING ONLY. Resolved-issue knowledge is NOT persisted here —
// that belongs on Walrus via MemWal. We store just the running message transcript
// needed to keep the model coherent within a session.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

export class SessionStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.sessions = new Map(); // id -> { messages: [], createdAt }
    this._load();
  }

  _load() {
    try {
      if (existsSync(this.filePath)) {
        const raw = JSON.parse(readFileSync(this.filePath, 'utf8'));
        for (const [id, s] of Object.entries(raw)) this.sessions.set(id, s);
      }
    } catch (err) {
      console.warn('[store] could not load sessions file:', err.message);
    }
  }

  _persist() {
    try {
      mkdirSync(dirname(this.filePath), { recursive: true });
      const obj = Object.fromEntries(this.sessions);
      writeFileSync(this.filePath, JSON.stringify(obj, null, 2));
    } catch (err) {
      console.warn('[store] could not persist sessions file:', err.message);
    }
  }

  get(id) {
    if (!this.sessions.has(id)) {
      this.sessions.set(id, { messages: [], createdAt: Date.now() });
    }
    return this.sessions.get(id);
  }

  /** Replace a session's message list (the model transcript) and persist. */
  setMessages(id, messages) {
    const s = this.get(id);
    s.messages = pruneTranscript(messages);
    this._persist();
  }

  reset(id) {
    this.sessions.set(id, { messages: [], createdAt: Date.now() });
    this._persist();
  }
}

/**
 * Safely prunes a message transcript to prevent exceeding model context windows (e.g. 32k tokens).
 * Drops whole older turns (user -> assistant -> tool) to avoid leaving orphaned tool messages.
 */
export function pruneTranscript(messages, maxTotalChars = 32000, maxMessages = 16) {
  if (!Array.isArray(messages) || messages.length <= 2) return messages;

  let totalChars = messages.reduce(
    (acc, m) => acc + (typeof m.content === 'string' ? m.content.length : 0),
    0
  );
  if (totalChars <= maxTotalChars && messages.length <= maxMessages) return messages;

  const userIndices = [];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === 'user') userIndices.push(i);
  }

  // Keep at least the latest user turn
  while (userIndices.length > 1 && (totalChars > maxTotalChars || messages.length > maxMessages)) {
    const nextUserIdx = userIndices[1];
    messages.splice(0, nextUserIdx);
    userIndices.shift();
    for (let i = 0; i < userIndices.length; i++) userIndices[i] -= nextUserIdx;
    totalChars = messages.reduce(
      (acc, m) => acc + (typeof m.content === 'string' ? m.content.length : 0),
      0
    );
  }

  return messages;
}
