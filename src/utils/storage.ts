// ─────────────────────────────────────────────────────────────
// MyFitAI — Typed localStorage Wrapper
// All keys are prefixed with 'myfitai_{uid}_' to avoid collisions
// and ensure complete isolation between different user accounts.
// ─────────────────────────────────────────────────────────────

import { auth } from '../services/firebase';

/**
 * Helper to get the dynamically scoped prefix.
 * We evaluate this lazily inside methods to ensure it grabs the latest UID
 * after a login/logout event occurs.
 */
function getPrefix(): string {
  const uid = auth.currentUser?.uid || 'guest';
  return `myfitai_${uid}_`;
}

export const storage = {
  /**
   * Get a value from localStorage, parsed as JSON.
   * Returns null if the key doesn't exist or parsing fails.
   */
  get<T>(key: string): T | null {
    const prefix = getPrefix();
    try {
      const raw = localStorage.getItem(`${prefix}${key}`);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      console.warn(`[storage] Failed to parse key: ${prefix}${key}`);
      return null;
    }
  },

  /**
   * Set a value in localStorage, serialized as JSON.
   */
  set<T>(key: string, value: T): void {
    const prefix = getPrefix();
    try {
      localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(`[storage] Failed to set key: ${prefix}${key}`, e);
    }
  },

  /**
   * Remove a value from localStorage.
   */
  remove(key: string): void {
    const prefix = getPrefix();
    localStorage.removeItem(`${prefix}${key}`);
  },

  /**
   * Check if a key exists in localStorage.
   */
  has(key: string): boolean {
    const prefix = getPrefix();
    return localStorage.getItem(`${prefix}${key}`) !== null;
  },

  /**
   * Get all keys with the dynamically scoped prefix.
   */
  keys(): string[] {
    const prefix = getPrefix();
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        result.push(key.slice(prefix.length));
      }
    }
    return result;
  },
};
