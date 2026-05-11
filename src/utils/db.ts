// ─────────────────────────────────────────────────────────────
// MyFitAI — IndexedDB Wrapper (zero external dependencies)
// Database: 'myfitai_db', version 1
// Stores: workoutSessions, workoutTemplates, exercises, programs
// ─────────────────────────────────────────────────────────────

import type { WorkoutSession, WorkoutTemplate } from '../types/workout';
import type { Exercise } from '../types/exercise';
import type { Program } from '../types/program';

const DB_NAME = 'myfitai_db';
const DB_VERSION = 1;

const STORES = {
  sessions: 'workoutSessions',
  templates: 'workoutTemplates',
  exercises: 'exercises',
  programs: 'programs',
} as const;

/** Cached database connection */
let cachedDB: IDBDatabase | null = null;

/**
 * Open (or create) the IndexedDB database.
 * Caches the connection for reuse.
 */
function getDB(): Promise<IDBDatabase> {
  if (cachedDB) return Promise.resolve(cachedDB);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      // Create object stores if they don't exist
      if (!database.objectStoreNames.contains(STORES.sessions)) {
        const store = database.createObjectStore(STORES.sessions, { keyPath: 'id' });
        store.createIndex('startedAt', 'startedAt', { unique: false });
        store.createIndex('templateId', 'templateId', { unique: false });
      }
      if (!database.objectStoreNames.contains(STORES.templates)) {
        database.createObjectStore(STORES.templates, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.exercises)) {
        database.createObjectStore(STORES.exercises, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.programs)) {
        database.createObjectStore(STORES.programs, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      cachedDB = request.result;

      // Handle unexpected close (e.g., browser clears storage)
      cachedDB.onclose = () => {
        cachedDB = null;
      };

      resolve(cachedDB);
    };

    request.onerror = () => {
      console.error('[db] Failed to open IndexedDB:', request.error);
      reject(request.error);
    };
  });
}

// ─── Generic CRUD Helpers ──────────────────────────────────

async function getAll<T>(storeName: string): Promise<T[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

async function getById<T>(storeName: string, id: string): Promise<T | undefined> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

async function save<T>(storeName: string, item: T): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteById(storeName: string, id: string): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getByIndex<T>(
  storeName: string,
  indexName: string,
  range: IDBKeyRange
): Promise<T[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(range);
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

async function clearStore(storeName: string): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ─── Public API ────────────────────────────────────────────

export const db = {
  sessions: {
    getAll: () => getAll<WorkoutSession>(STORES.sessions),
    getById: (id: string) => getById<WorkoutSession>(STORES.sessions, id),
    save: (session: WorkoutSession) => save(STORES.sessions, session),
    delete: (id: string) => deleteById(STORES.sessions, id),
    clear: () => clearStore(STORES.sessions),

    /** Get sessions within a date range (inclusive) */
    getByDateRange: (start: Date, end: Date) =>
      getByIndex<WorkoutSession>(
        STORES.sessions,
        'startedAt',
        IDBKeyRange.bound(start.toISOString(), end.toISOString())
      ),

    /** Get sessions for a specific template */
    getByTemplate: (templateId: string) =>
      getByIndex<WorkoutSession>(
        STORES.sessions,
        'templateId',
        IDBKeyRange.only(templateId)
      ),
  },

  templates: {
    getAll: () => getAll<WorkoutTemplate>(STORES.templates),
    getById: (id: string) => getById<WorkoutTemplate>(STORES.templates, id),
    save: (template: WorkoutTemplate) => save(STORES.templates, template),
    delete: (id: string) => deleteById(STORES.templates, id),
    clear: () => clearStore(STORES.templates),
  },

  exercises: {
    getAll: () => getAll<Exercise>(STORES.exercises),
    getById: (id: string) => getById<Exercise>(STORES.exercises, id),
    save: (exercise: Exercise) => save(STORES.exercises, exercise),
    delete: (id: string) => deleteById(STORES.exercises, id),
    clear: () => clearStore(STORES.exercises),
  },

  programs: {
    getAll: () => getAll<Program>(STORES.programs),
    getById: (id: string) => getById<Program>(STORES.programs, id),
    save: (program: Program) => save(STORES.programs, program),
    delete: (id: string) => deleteById(STORES.programs, id),
    clear: () => clearStore(STORES.programs),
  },
};
