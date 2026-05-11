// ─────────────────────────────────────────────────────────────
// MyFitAI — Workout Builder & Active Session Context
// Manages template creation, active session tracking, PR detection,
// crash recovery, and Wake Lock API integration.
// ─────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../utils/db';
import { storage } from '../utils/storage';
import type {
  WorkoutTemplate,
  WorkoutSession,
  SessionExercise,
  LoggedSet,
  PRRecord,
  WorkoutType,
} from '../types/workout';
import { calculateSessionVolume, calculate1RM } from '../types/workout';
import type { MuscleGroup } from '../types/exercise';

// ─── Types ─────────────────────────────────────────────────

interface RestTimerState {
  remaining: number;
  total: number;
}

interface WorkoutBuilderContextType {
  // Templates
  templates: WorkoutTemplate[];
  loadTemplates: () => Promise<void>;
  saveTemplate: (template: WorkoutTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string) => Promise<WorkoutTemplate | null>;

  // Active Session
  activeSession: WorkoutSession | null;
  isSessionActive: boolean;
  sessionElapsed: number;
  startSession: (template?: WorkoutTemplate) => void;
  endSession: () => Promise<WorkoutSession | null>;
  cancelSession: () => void;

  // Set Logging
  logSet: (exerciseIdx: number, setIdx: number, set: LoggedSet) => void;
  addSetToExercise: (exerciseIdx: number) => void;
  removeSet: (exerciseIdx: number, setIdx: number) => void;
  updateExerciseNotes: (exerciseIdx: number, notes: string) => void;

  // Rest Timer
  restTimer: RestTimerState | null;
  startRestTimer: (seconds: number) => void;
  skipRest: () => void;

  // PR Detection
  personalRecords: Map<string, PRRecord[]>;
  loadPRs: () => Promise<void>;
  checkForPR: (exerciseId: string, exerciseName: string, weight: number, reps: number, sessionId: string) => PRRecord | null;

  // History
  sessions: WorkoutSession[];
  loadSessions: () => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  updateSession: (session: WorkoutSession) => Promise<void>;

  // Previous session data for ghost values
  getPreviousSessionData: (exerciseId: string) => { reps: number; weight: number; rpe: number }[];
}

const WorkoutBuilderContext = createContext<WorkoutBuilderContextType | undefined>(undefined);

const CRASH_RECOVERY_KEY = 'active_session_backup';
const PR_STORAGE_KEY = 'personal_records';

export function WorkoutBuilderProvider({ children }: { children: React.ReactNode }) {
  // ─── State ────────────────────────────────────────────────
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState<RestTimerState | null>(null);
  const [personalRecords, setPersonalRecords] = useState<Map<string, PRRecord[]>>(new Map());

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSessionActive = activeSession !== null;
  const isRestTimerRunning = Boolean(restTimer && restTimer.remaining > 0);

  // ─── Load Data on Mount ───────────────────────────────────

  useEffect(() => {
    loadTemplates();
    loadSessions();
    loadPRs();

    // Check for crash recovery
    const backup = storage.get<WorkoutSession>(CRASH_RECOVERY_KEY);
    if (backup && !activeSession) {
      setActiveSession(backup);
      // Calculate elapsed from startedAt
      const elapsed = Math.floor((Date.now() - new Date(backup.startedAt).getTime()) / 1000);
      setSessionElapsed(elapsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Session Timer ────────────────────────────────────────

  useEffect(() => {
    if (isSessionActive) {
      timerRef.current = setInterval(() => {
        setSessionElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive]);

  // ─── Rest Timer ───────────────────────────────────────────

  useEffect(() => {
    if (isRestTimerRunning) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (!prev || prev.remaining <= 1) {
            // Timer complete — vibrate
            if (navigator.vibrate) navigator.vibrate(200);
            return null;
          }
          return { ...prev, remaining: prev.remaining - 1 };
        });
      }, 1000);
    } else {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
        restTimerRef.current = null;
      }
    }
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isRestTimerRunning]);

  // ─── Crash Recovery — save active session every 10s ───────

  useEffect(() => {
    if (!activeSession) {
      storage.remove(CRASH_RECOVERY_KEY);
      return;
    }

    const interval = setInterval(() => {
      storage.set(CRASH_RECOVERY_KEY, activeSession);
    }, 10000);

    return () => clearInterval(interval);
  }, [activeSession]);

  // ─── Wake Lock ────────────────────────────────────────────

  const acquireWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      // Wake Lock not supported or denied — not critical
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  // ─── Template Operations ──────────────────────────────────

  const loadTemplates = useCallback(async () => {
    try {
      const all = await db.templates.getAll();
      setTemplates(all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    } catch (e) {
      console.error('[WorkoutBuilder] Failed to load templates:', e);
    }
  }, []);

  const saveTemplate = useCallback(async (template: WorkoutTemplate) => {
    await db.templates.save(template);
    await loadTemplates();
  }, [loadTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    await db.templates.delete(id);
    await loadTemplates();
  }, [loadTemplates]);

  const duplicateTemplate = useCallback(async (id: string): Promise<WorkoutTemplate | null> => {
    const original = await db.templates.getById(id);
    if (!original) return null;
    const duplicate: WorkoutTemplate = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.templates.save(duplicate);
    await loadTemplates();
    return duplicate;
  }, [loadTemplates]);

  // ─── Session Operations ───────────────────────────────────

  const startSession = useCallback((template?: WorkoutTemplate) => {
    const exercises: SessionExercise[] = template
      ? template.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          thumbnailEmoji: ex.thumbnailEmoji,
          primaryMuscles: ex.primaryMuscles,
          sets: ex.sets.map(() => ({
            reps: 0,
            weight: 0,
            rpe: 0,
            setType: 'normal' as const,
            completed: false,
            skipped: false,
            timestamp: '',
          })),
        }))
      : [];

    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      templateId: template?.id,
      templateName: template?.name || 'Quick Workout',
      type: (template?.type || 'strength') as WorkoutType,
      startedAt: new Date().toISOString(),
      duration: 0,
      exercises,
      totalVolume: 0,
      totalSets: 0,
      totalReps: 0,
      prsHit: [],
      notes: '',
      musclesWorked: template?.targetMuscles || [],
    };

    setActiveSession(session);
    setSessionElapsed(0);
    setRestTimer(null);
    acquireWakeLock();
  }, []);

  const logSet = useCallback((exerciseIdx: number, setIdx: number, set: LoggedSet) => {
    setActiveSession(prev => {
      if (!prev) return prev;
      const exercises = [...prev.exercises];
      const exercise = { ...exercises[exerciseIdx] };
      const sets = [...exercise.sets];
      sets[setIdx] = set;
      exercise.sets = sets;
      exercises[exerciseIdx] = exercise;
      return { ...prev, exercises };
    });
  }, []);

  const addSetToExercise = useCallback((exerciseIdx: number) => {
    setActiveSession(prev => {
      if (!prev) return prev;
      const exercises = [...prev.exercises];
      const exercise = { ...exercises[exerciseIdx] };
      exercise.sets = [...exercise.sets, {
        reps: 0,
        weight: 0,
        rpe: 0,
        setType: 'normal' as const,
        completed: false,
        skipped: false,
        timestamp: '',
      }];
      exercises[exerciseIdx] = exercise;
      return { ...prev, exercises };
    });
  }, []);

  const removeSet = useCallback((exerciseIdx: number, setIdx: number) => {
    setActiveSession(prev => {
      if (!prev) return prev;
      const exercises = [...prev.exercises];
      const exercise = { ...exercises[exerciseIdx] };
      exercise.sets = exercise.sets.filter((_, i) => i !== setIdx);
      exercises[exerciseIdx] = exercise;
      return { ...prev, exercises };
    });
  }, []);

  const updateExerciseNotes = useCallback((exerciseIdx: number, notes: string) => {
    setActiveSession(prev => {
      if (!prev) return prev;
      const exercises = [...prev.exercises];
      exercises[exerciseIdx] = { ...exercises[exerciseIdx], notes };
      return { ...prev, exercises };
    });
  }, []);

  const endSession = useCallback(async (): Promise<WorkoutSession | null> => {
    if (!activeSession) return null;

    const completedSession: WorkoutSession = {
      ...activeSession,
      endedAt: new Date().toISOString(),
      duration: sessionElapsed,
      totalVolume: calculateSessionVolume(activeSession.exercises),
      totalSets: activeSession.exercises.reduce((sum, ex) =>
        sum + ex.sets.filter(s => s.completed).length, 0
      ),
      totalReps: activeSession.exercises.reduce((sum, ex) =>
        sum + ex.sets.filter(s => s.completed).reduce((r, s) => r + s.reps, 0), 0
      ),
      musclesWorked: [...new Set(
        activeSession.exercises.flatMap(ex => ex.primaryMuscles || [])
      )] as MuscleGroup[],
    };

    // Detect PRs
    const prs: PRRecord[] = [];
    for (const ex of completedSession.exercises) {
      for (const set of ex.sets) {
        if (!set.completed || set.skipped) continue;
        const pr = checkForPR(ex.exerciseId, ex.exerciseName, set.weight, set.reps, completedSession.id);
        if (pr) prs.push(pr);
      }
    }
    completedSession.prsHit = prs;

    // Save
    await db.sessions.save(completedSession);
    storage.remove(CRASH_RECOVERY_KEY);
    releaseWakeLock();

    setActiveSession(null);
    setSessionElapsed(0);
    setRestTimer(null);

    // Refresh sessions list
    await loadSessions();

    return completedSession;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession, sessionElapsed]);

  const cancelSession = useCallback(() => {
    setActiveSession(null);
    setSessionElapsed(0);
    setRestTimer(null);
    storage.remove(CRASH_RECOVERY_KEY);
    releaseWakeLock();
  }, []);

  // ─── Rest Timer ───────────────────────────────────────────

  const startRestTimer = useCallback((seconds: number) => {
    setRestTimer({ remaining: seconds, total: seconds });
  }, []);

  const skipRest = useCallback(() => {
    setRestTimer(null);
  }, []);

  // ─── PR Detection ────────────────────────────────────────

  const loadPRs = useCallback(async () => {
    const saved = storage.get<Record<string, PRRecord[]>>(PR_STORAGE_KEY);
    if (saved) {
      setPersonalRecords(new Map(Object.entries(saved)));
    }
  }, []);

  const savePRs = useCallback((prs: Map<string, PRRecord[]>) => {
    const obj: Record<string, PRRecord[]> = {};
    prs.forEach((value, key) => {
      obj[key] = value;
    });
    storage.set(PR_STORAGE_KEY, obj);
  }, []);

  const checkForPR = useCallback((
    exerciseId: string,
    exerciseName: string,
    weight: number,
    reps: number,
    sessionId: string
  ): PRRecord | null => {
    if (weight <= 0 || reps <= 0) return null;

    const existing = personalRecords.get(exerciseId) || [];
    const currentVolume = weight * reps;
    const current1RM = calculate1RM(weight, reps);

    // Check weight PR
    const bestWeight = existing.find(pr => pr.type === 'weight');
    if (!bestWeight || weight > bestWeight.value) {
      const pr: PRRecord = {
        exerciseId,
        exerciseName,
        type: 'weight',
        value: weight,
        previousValue: bestWeight?.value,
        date: new Date().toISOString(),
        sessionId,
      };

      const updated = new Map(personalRecords);
      const exPRs = [...(updated.get(exerciseId) || [])];
      const existingIdx = exPRs.findIndex(p => p.type === 'weight');
      if (existingIdx >= 0) exPRs[existingIdx] = pr;
      else exPRs.push(pr);
      updated.set(exerciseId, exPRs);
      setPersonalRecords(updated);
      savePRs(updated);

      // Vibrate for PR
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      return pr;
    }

    // Check 1RM PR
    const best1RM = existing.find(pr => pr.type === '1rm');
    if (!best1RM || current1RM > best1RM.value) {
      const pr: PRRecord = {
        exerciseId,
        exerciseName,
        type: '1rm',
        value: current1RM,
        previousValue: best1RM?.value,
        date: new Date().toISOString(),
        sessionId,
      };

      const updated = new Map(personalRecords);
      const exPRs = [...(updated.get(exerciseId) || [])];
      const existingIdx = exPRs.findIndex(p => p.type === '1rm');
      if (existingIdx >= 0) exPRs[existingIdx] = pr;
      else exPRs.push(pr);
      updated.set(exerciseId, exPRs);
      setPersonalRecords(updated);
      savePRs(updated);

      return pr;
    }

    // Check volume PR
    const bestVolume = existing.find(pr => pr.type === 'volume');
    if (!bestVolume || currentVolume > bestVolume.value) {
      const pr: PRRecord = {
        exerciseId,
        exerciseName,
        type: 'volume',
        value: currentVolume,
        previousValue: bestVolume?.value,
        date: new Date().toISOString(),
        sessionId,
      };

      const updated = new Map(personalRecords);
      const exPRs = [...(updated.get(exerciseId) || [])];
      const existingIdx = exPRs.findIndex(p => p.type === 'volume');
      if (existingIdx >= 0) exPRs[existingIdx] = pr;
      else exPRs.push(pr);
      updated.set(exerciseId, exPRs);
      setPersonalRecords(updated);
      savePRs(updated);

      return pr;
    }

    return null;
  }, [personalRecords, savePRs]);

  // ─── History ──────────────────────────────────────────────

  const loadSessions = useCallback(async () => {
    try {
      const all = await db.sessions.getAll();
      setSessions(all.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()));
    } catch (e) {
      console.error('[WorkoutBuilder] Failed to load sessions:', e);
    }
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    await db.sessions.delete(id);
    await loadSessions();
  }, [loadSessions]);

  const updateSession = useCallback(async (session: WorkoutSession) => {
    await db.sessions.save(session);
    await loadSessions();
  }, [loadSessions]);

  // ─── Ghost Values ────────────────────────────────────────

  const getPreviousSessionData = useCallback((exerciseId: string) => {
    // Find the most recent session containing this exercise
    for (const session of sessions) {
      const ex = session.exercises.find(e => e.exerciseId === exerciseId);
      if (ex) {
        return ex.sets
          .filter(s => s.completed)
          .map(s => ({ reps: s.reps, weight: s.weight, rpe: s.rpe }));
      }
    }
    return [];
  }, [sessions]);

  // ─── Provider ─────────────────────────────────────────────

  return (
    <WorkoutBuilderContext.Provider
      value={{
        templates,
        loadTemplates,
        saveTemplate,
        deleteTemplate,
        duplicateTemplate,
        activeSession,
        isSessionActive,
        sessionElapsed,
        startSession,
        endSession,
        cancelSession,
        logSet,
        addSetToExercise,
        removeSet,
        updateExerciseNotes,
        restTimer,
        startRestTimer,
        skipRest,
        personalRecords,
        loadPRs,
        checkForPR,
        sessions,
        loadSessions,
        deleteSession,
        updateSession,
        getPreviousSessionData,
      }}
    >
      {children}
    </WorkoutBuilderContext.Provider>
  );
}

export function useWorkoutBuilder() {
  const context = useContext(WorkoutBuilderContext);
  if (!context) throw new Error('useWorkoutBuilder must be used within WorkoutBuilderProvider');
  return context;
}
