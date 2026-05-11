// ─────────────────────────────────────────────────────────────
// MyFitAI — Typed localStorage Wrapper
// All keys are prefixed with 'myfitai_' to avoid collisions
// with existing 'kinetic_' keys used by the original codebase.
// ─────────────────────────────────────────────────────────────

const PREFIX = 'myfitai_';

export const storage = {
  /**
   * Get a value from localStorage, parsed as JSON.
   * Returns null if the key doesn't exist or parsing fails.
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`${PREFIX}${key}`);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      console.warn(`[storage] Failed to parse key: ${PREFIX}${key}`);
      return null;
    }
  },

  /**
   * Set a value in localStorage, serialized as JSON.
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(`[storage] Failed to set key: ${PREFIX}${key}`, e);
    }
  },

  /**
   * Remove a value from localStorage.
   */
  remove(key: string): void {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  /**
   * Check if a key exists in localStorage.
   */
  has(key: string): boolean {
    return localStorage.getItem(`${PREFIX}${key}`) !== null;
  },

  /**
   * Get all keys with the myfitai_ prefix.
   */
  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        result.push(key.slice(PREFIX.length));
      }
    }
    return result;
  },
};
