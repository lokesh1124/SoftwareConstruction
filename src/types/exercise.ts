// ─────────────────────────────────────────────────────────────
// MyFitAI — Exercise Type Definitions
// ─────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'traps'
  | 'lats'
  | 'hip_flexors'
  | 'adductors'
  | 'abductors'
  | 'full_body';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'band'
  | 'smith_machine'
  | 'ez_bar'
  | 'trap_bar'
  | 'suspension'
  | 'other';

export type ExerciseCategory =
  | 'compound'
  | 'isolation'
  | 'cardio'
  | 'mobility'
  | 'plyometric';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  instructions: string[];
  tips: string[];
  thumbnailEmoji: string;
  isCustom: boolean;
  videoUrl?: string;
  imageUrl?: string;
  createdAt?: string;
}

/** Display labels for muscle groups */
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  core: 'Core',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  traps: 'Traps',
  lats: 'Lats',
  hip_flexors: 'Hip Flexors',
  adductors: 'Adductors',
  abductors: 'Abductors',
  full_body: 'Full Body',
};

/** Display labels for equipment */
export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  cable: 'Cable',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  kettlebell: 'Kettlebell',
  band: 'Resistance Band',
  smith_machine: 'Smith Machine',
  ez_bar: 'EZ Bar',
  trap_bar: 'Trap Bar',
  suspension: 'Suspension',
  other: 'Other',
};

/** Material icon for each muscle group */
export const MUSCLE_GROUP_ICONS: Record<MuscleGroup, string> = {
  chest: '🫁',
  back: '🔙',
  shoulders: '💪',
  biceps: '💪',
  triceps: '💪',
  forearms: '🤜',
  core: '🎯',
  quads: '🦵',
  hamstrings: '🦵',
  glutes: '🍑',
  calves: '🦶',
  traps: '🔺',
  lats: '🦅',
  hip_flexors: '🦴',
  adductors: '🦵',
  abductors: '🦵',
  full_body: '🏋️',
};
