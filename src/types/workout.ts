// ─────────────────────────────────────────────────────────────
// MyFitAI — Workout Type Definitions
// These are NEW types used by the new Workout Builder & Session
// system. They do NOT replace the types inside WorkoutPlanner.tsx.
// ─────────────────────────────────────────────────────────────

import type { MuscleGroup, EquipmentType } from './exercise';

/** The type of an individual set */
export type SetType = 'normal' | 'warmup' | 'drop' | 'amrap' | 'failure';

/** Overall workout category */
export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'mobility' | 'flexibility' | 'custom';

/** A planned set within a workout template */
export interface PlannedSet {
  targetReps?: number;
  targetWeight?: number;
  targetDuration?: number; // seconds, for timed exercises
  rpe?: number; // 1-10
}

/** An exercise slot within a workout template */
export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  thumbnailEmoji?: string;
  equipment?: EquipmentType;
  primaryMuscles?: MuscleGroup[];
  sets: PlannedSet[];
  restSeconds: number;
  notes: string;
  supersetWith?: number; // index of paired exercise
}

/** A saved workout template (blueprint, not a completed session) */
export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  type: WorkoutType;
  targetMuscles: MuscleGroup[];
  exercises: WorkoutExercise[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
  estimatedDuration?: number; // minutes
  estimatedCalories?: number;
}

/** A single logged set during an active session */
export interface LoggedSet {
  reps: number;
  weight: number;
  rpe: number;
  setType: SetType;
  completed: boolean;
  skipped: boolean;
  duration?: number; // seconds, for timed exercises
  timestamp: string; // ISO — when the set was completed
}

/** An exercise as logged during a session */
export interface SessionExercise {
  exerciseId: string;
  exerciseName: string;
  thumbnailEmoji?: string;
  primaryMuscles?: MuscleGroup[];
  sets: LoggedSet[];
  notes?: string;
}

/** A personal record */
export interface PRRecord {
  exerciseId: string;
  exerciseName: string;
  type: 'weight' | 'reps' | 'volume' | '1rm';
  value: number;
  previousValue?: number;
  date: string; // ISO
  sessionId: string;
}

/** A completed workout session */
export interface WorkoutSession {
  id: string;
  templateId?: string;
  templateName: string;
  type: WorkoutType;
  startedAt: string; // ISO
  endedAt?: string; // ISO
  duration: number; // seconds
  exercises: SessionExercise[];
  totalVolume: number; // total weight × reps across all sets
  totalSets: number;
  totalReps: number;
  prsHit: PRRecord[];
  notes: string;
  rating?: number; // 1-5
  musclesWorked: MuscleGroup[];
}

/** Previous session data for ghost values */
export interface PreviousSetData {
  exerciseId: string;
  sets: Array<{
    reps: number;
    weight: number;
    rpe: number;
  }>;
}

/** Calculate estimated 1RM using Epley formula */
export function calculate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/** Calculate total volume for a set */
export function calculateSetVolume(weight: number, reps: number): number {
  return weight * reps;
}

/** Calculate total session volume */
export function calculateSessionVolume(exercises: SessionExercise[]): number {
  return exercises.reduce((total, ex) => {
    return total + ex.sets
      .filter(s => s.completed && !s.skipped)
      .reduce((exTotal, set) => exTotal + (set.weight * set.reps), 0);
  }, 0);
}

/** Format duration in seconds to mm:ss or h:mm:ss */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Format a weight value with unit */
export function formatWeight(value: number, unit: 'kg' | 'lbs'): string {
  return `${value}${unit === 'kg' ? 'kg' : 'lbs'}`;
}

/** Convert between kg and lbs */
export function convertWeight(value: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number {
  if (from === to) return value;
  if (from === 'kg') return Math.round(value * 2.20462 * 10) / 10;
  return Math.round(value / 2.20462 * 10) / 10;
}

/** Format large numbers with commas */
export function formatVolume(volume: number): string {
  return volume.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
