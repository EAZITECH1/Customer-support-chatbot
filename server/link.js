// server/link.js
// Cross-channel identity link service: maps temporary 6-character link codes
// between the Web Support Portal and Telegram (@EazitechSupportBot).
// Also persists linked identities into data/identities.json.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IDENTITIES_FILE = join(ROOT, 'data', 'identities.json');

class IdentityLinkManager {
  constructor() {
    this.pendingCodes = new Map(); // code -> { email, tenant, createdAt, expiresAt }
    this.identities = new Map();   // userId / chatId -> { email, tenant, linkedAt }
    this._load();
  }

  _load() {
    try {
      if (existsSync(IDENTITIES_FILE)) {
        const raw = JSON.parse(readFileSync(IDENTITIES_FILE, 'utf8'));
        for (const [k, v] of Object.entries(raw)) {
          this.identities.set(k, v);
        }
      }
    } catch (err) {
      console.warn('[link] Could not load identities file:', err.message);
    }
  }

  _persist() {
    try {
      mkdirSync(dirname(IDENTITIES_FILE), { recursive: true });
      const obj = Object.fromEntries(this.identities);
      writeFileSync(IDENTITIES_FILE, JSON.stringify(obj, null, 2));
    } catch (err) {
      console.warn('[link] Could not persist identities file:', err.message);
    }
  }

  /**
   * Generate a one-time link code for a developer email/tenant.
   * e.g., WAL-4821 valid for 15 minutes.
   */
  generateCode(email, tenant = '') {
    if (!email) throw new Error('Email is required');
    const cleanEmail = email.trim().toLowerCase();
    const cleanTenant = tenant.trim() || cleanEmail.split('@')[1] || 'default';
    
    // Generate random 4-char hex or alphanumeric code
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const code = `WAL-${randomHex}`;

    const now = Date.now();
    this.pendingCodes.set(code, {
      email: cleanEmail,
      tenant: cleanTenant,
      createdAt: now,
      expiresAt: now + 15 * 60 * 1000, // 15 mins
    });

    return {
      code,
      email: cleanEmail,
      tenant: cleanTenant,
      expiresIn: 900,
    };
  }

  /**
   * Verify and redeem a one-time code on Telegram.
   * Links the Telegram user/chat to the email and tenant.
   */
  redeemCode(code, telegramUser) {
    if (!code) return { ok: false, error: 'Code is required' };
    const cleanCode = code.trim().toUpperCase();
    const entry = this.pendingCodes.get(cleanCode);

    if (!entry) {
      return { ok: false, error: 'Invalid link code or code not found.' };
    }

    if (Date.now() > entry.expiresAt) {
      this.pendingCodes.delete(cleanCode);
      return { ok: false, error: 'Link code has expired. Please generate a new one on the web portal.' };
    }

    const tgKey = String(telegramUser.id || telegramUser.chatId);
    const linkData = {
      telegramId: tgKey,
      telegramUsername: telegramUser.username || '',
      email: entry.email,
      tenant: entry.tenant,
      linkedAt: Date.now(),
    };

    this.identities.set(tgKey, linkData);
    this._persist();
    this.pendingCodes.delete(cleanCode); // one-time use

    return {
      ok: true,
      email: entry.email,
      tenant: entry.tenant,
    };
  }

  /**
   * Lookup identity for a Telegram user ID.
   */
  getIdentityByTelegramId(telegramId) {
    return this.identities.get(String(telegramId)) || null;
  }
}

export const linkManager = new IdentityLinkManager();
