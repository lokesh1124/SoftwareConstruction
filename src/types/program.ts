// ─────────────────────────────────────────────────────────────
// MyFitAI — Program & Routine Type Definitions
// ─────────────────────────────────────────────────────────────

export type ProgramDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';

export type ProgramGoal =
  | 'muscle_gain'
  | 'fat_loss'
  | 'strength'
  | 'endurance'
  | 'general_fitness'
  | 'powerlifting'
  | 'bodybuilding'
  | 'athletic_performance';

/** A single day slot within a week */
export interface DaySlot {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  templateId?: string; // references a WorkoutTemplate.id
  templateName?: string;
  isRest: boolean;
  label: string; // e.g. "Push Day" or "Rest"
}

/** A week's schedule within a program */
export interface WeekSchedule {
  weekNumber: number;
  days: DaySlot[];
}

/** A multi-week training program */
export interface Program {
  id: string;
  name: string;
  description: string;
  goal: ProgramGoal;
  durationWeeks: number;
  daysPerWeek: number;
  difficulty: ProgramDifficulty;
  schedule: WeekSchedule[];
  isActive: boolean;
  currentWeek: number;
  startedAt?: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
  authorId?: string; // for community-published programs
  authorName?: string;
  followerCount?: number;
  rating?: number; // 1-5 average
  timesCompleted?: number;
  tags?: string[];
}

/** Display labels for program goals */
export const PROGRAM_GOAL_LABELS: Record<ProgramGoal, string> = {
  muscle_gain: 'Muscle Gain',
  fat_loss: 'Fat Loss',
  strength: 'Strength',
  endurance: 'Endurance',
  general_fitness: 'General Fitness',
  powerlifting: 'Powerlifting',
  bodybuilding: 'Bodybuilding',
  athletic_performance: 'Athletic Performance',
};

/** Day of week labels */
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const DAY_LABELS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
