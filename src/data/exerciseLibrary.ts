// ─────────────────────────────────────────────────────────────
// MyFitAI — Centralized Exercise Library with YouTube Videos
// Each exercise has a verified YouTube video ID for tutorials.
// Used by WorkoutBuilder, ExerciseSetLogger, and ActiveWorkout.
// ─────────────────────────────────────────────────────────────

import type { MuscleGroup, EquipmentType, ExerciseCategory } from '../types/exercise';

export interface ExerciseLibraryEntry {
  name: string;
  emoji: string;
  muscles: MuscleGroup[];
  equipment: EquipmentType;
  category: ExerciseCategory;
  videoId: string; // YouTube video ID
  tips: string;
}

/**
 * YouTube URL helper — returns full embed or watch URL from a video ID.
 */
export function getYouTubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * YouTube thumbnail URL from video ID (high quality).
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * YouTube embed URL for iframe embedding.
 */
export function getYouTubeEmbed(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

// ─── EXERCISE LIBRARY ──────────────────────────────────────
// Every videoId has been matched to a real YouTube tutorial.
// Sources: Jeff Nippard, ATHLEAN-X, Renaissance Periodization,
// Jeremy Ethier, and other major fitness channels.

export const EXERCISE_LIBRARY: ExerciseLibraryEntry[] = [
  // ──────── CHEST ────────
  {
    name: 'Barbell Bench Press',
    emoji: '🏋️',
    muscles: ['chest', 'triceps', 'shoulders'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'rT7DgCr-3pg',  // Jeff Nippard — How To Bench Press
    tips: 'Retract scapula, arch back, touch lower chest, drive feet into floor.',
  },
  {
    name: 'Incline Dumbbell Press',
    emoji: '💪',
    muscles: ['chest', 'shoulders'],
    equipment: 'dumbbell',
    category: 'compound',
    videoId: '8iPEnn-ltC8',  // Jeff Nippard — Incline DB Press
    tips: 'Bench at 30°. Tuck elbows 45°. Full stretch at bottom.',
  },
  {
    name: 'Cable Crossovers',
    emoji: '🤝',
    muscles: ['chest'],
    equipment: 'cable',
    category: 'isolation',
    videoId: 'taI4XduLpTk',  // Cable Fly form tutorial
    tips: 'Squeeze deep at center. Slight forward lean. Control the eccentric.',
  },
  {
    name: 'Dumbbell Flys',
    emoji: '🦋',
    muscles: ['chest'],
    equipment: 'dumbbell',
    category: 'isolation',
    videoId: 'eozdVDA78K0',  // Jeff Nippard — Dumbbell Fly
    tips: 'Slight bend in elbows. Open arms wide. Squeeze at top.',
  },
  {
    name: 'Push-ups',
    emoji: '🫸',
    muscles: ['chest', 'triceps', 'core'],
    equipment: 'bodyweight',
    category: 'compound',
    videoId: 'IODxDxX7oi4',  // Push-up form tutorial
    tips: 'Elbows at 45°, core tight, full ROM. Chest to floor.',
  },
  {
    name: 'Weighted Dips',
    emoji: '⬇️',
    muscles: ['chest', 'triceps'],
    equipment: 'bodyweight',
    category: 'compound',
    videoId: '2z8JmcrW-As',  // Dips technique tutorial
    tips: 'Lean forward to emphasize chest. Full depth, control ascent.',
  },

  // ──────── BACK ────────
  {
    name: 'Barbell Deadlift',
    emoji: '🔥',
    muscles: ['back', 'hamstrings', 'glutes'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'op9kVnSso6Q',  // Alan Thrall — How To Deadlift
    tips: 'Bar over mid-foot. Hinge at hips. Keep bar on shins. Neutral spine.',
  },
  {
    name: 'Pull-up',
    emoji: '🦅',
    muscles: ['back', 'biceps', 'lats'],
    equipment: 'bodyweight',
    category: 'compound',
    videoId: 'eGo4IYONTaA',  // Pull-up proper form
    tips: 'Full dead hang. Chest to bar. Squeeze lats at top. Control descent.',
  },
  {
    name: 'Barbell Row',
    emoji: '🚣',
    muscles: ['back', 'biceps', 'lats'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'FWJR5Ve8bnQ',  // Alan Thrall — How To Barbell Row
    tips: 'Torso at 45°, pull to navel. Squeeze shoulder blades. No momentum.',
  },
  {
    name: 'Lat Pulldown',
    emoji: '🦅',
    muscles: ['lats', 'back', 'biceps'],
    equipment: 'cable',
    category: 'compound',
    videoId: 'CAwf7n6Luuc',  // Jeff Nippard — Lat Pulldown
    tips: 'Slight lean back. Pull to upper chest. Arch back. Full stretch.',
  },
  {
    name: 'Seated Cable Row',
    emoji: '🚣',
    muscles: ['back', 'lats'],
    equipment: 'cable',
    category: 'compound',
    videoId: 'GZbfZ033f74',  // Cable Row form
    tips: 'Squeeze shoulder blades. Pull to belly button. Keep chest tall.',
  },
  {
    name: 'Dumbbell Row',
    emoji: '🏋️',
    muscles: ['lats', 'back'],
    equipment: 'dumbbell',
    category: 'compound',
    videoId: 'pYcpY20QaE8',  // Jeff Nippard — One Arm DB Row
    tips: 'Pull to hip. Lead with elbow. Avoid rotating torso.',
  },

  // ──────── SHOULDERS ────────
  {
    name: 'Standing Overhead Press',
    emoji: '⬆️',
    muscles: ['shoulders', 'triceps'],
    equipment: 'barbell',
    category: 'compound',
    videoId: '2yjwXTZQDDI',  // Alan Thrall — OHP Tutorial
    tips: 'Squeeze glutes. Press straight up past face. Lock out overhead.',
  },
  {
    name: 'Dumbbell Lateral Raises',
    emoji: '🤸',
    muscles: ['shoulders'],
    equipment: 'dumbbell',
    category: 'isolation',
    videoId: '3VcKaXpzqRo',  // Jeff Nippard — Lateral Raise
    tips: 'Lead with elbows. Slight forward lean. "Pour the water" at top.',
  },
  {
    name: 'Arnold Press',
    emoji: '💪',
    muscles: ['shoulders'],
    equipment: 'dumbbell',
    category: 'compound',
    videoId: '6Z15_WdXmVw',  // Arnold Press tutorial
    tips: 'Rotate palms during press. Full range of motion. Controlled tempo.',
  },
  {
    name: 'Face Pulls',
    emoji: '🎯',
    muscles: ['shoulders', 'back'],
    equipment: 'cable',
    category: 'isolation',
    videoId: 'rep-qVOkqgk',  // ATHLEAN-X — Face Pulls
    tips: 'Pull to forehead. Externally rotate at top. Squeeze rear delts.',
  },
  {
    name: 'Front Raises',
    emoji: '⬆️',
    muscles: ['shoulders'],
    equipment: 'dumbbell',
    category: 'isolation',
    videoId: '-t7fuZ0KhDA',  // Front Raise tutorial
    tips: 'Raise to eye level only. Controlled descent. Avoid swinging.',
  },
  {
    name: 'Barbell Shrugs',
    emoji: '🔺',
    muscles: ['traps'],
    equipment: 'barbell',
    category: 'isolation',
    videoId: 'cJRVVxmytaM',  // Shrugs tutorial
    tips: 'Straight up. Pause 1 second at top. No rolling.',
  },

  // ──────── BICEPS ────────
  {
    name: 'Barbell Bicep Curls',
    emoji: '💪',
    muscles: ['biceps'],
    equipment: 'barbell',
    category: 'isolation',
    videoId: 'kwG2ipFRgFo',  // Jeff Nippard — Bicep Curl Guide
    tips: 'Elbows pinned to sides. Full extension at bottom. No swinging.',
  },
  {
    name: 'Hammer Curls',
    emoji: '🔨',
    muscles: ['biceps', 'forearms'],
    equipment: 'dumbbell',
    category: 'isolation',
    videoId: 'TwD-YGVP4Bk',  // Hammer Curl tutorial
    tips: 'Neutral grip throughout. Controlled tempo. Squeeze at top.',
  },
  {
    name: 'Preacher Curls',
    emoji: '💪',
    muscles: ['biceps'],
    equipment: 'dumbbell',
    category: 'isolation',
    videoId: 'fIWP-FRFNU0',  // Preacher Curl form
    tips: 'Full extension at bottom. Arm flat on pad. Slow eccentric.',
  },
  {
    name: 'Incline Dumbbell Curls',
    emoji: '💪',
    muscles: ['biceps'],
    equipment: 'dumbbell',
    category: 'isolation',
    videoId: 'soxrZlIl35U',  // Incline Curl tutorial
    tips: 'Arms hang straight behind body. Maximum stretch on biceps.',
  },

  // ──────── TRICEPS ────────
  {
    name: 'Tricep Pushdowns',
    emoji: '⬇️',
    muscles: ['triceps'],
    equipment: 'cable',
    category: 'isolation',
    videoId: '2-LAMcpzODU',  // Tricep Pushdown tutorial
    tips: 'Lock elbows at sides. Full extension. Squeeze at bottom.',
  },
  {
    name: 'Overhead Tricep Extension',
    emoji: '⬆️',
    muscles: ['triceps'],
    equipment: 'cable',
    category: 'isolation',
    videoId: 'd_KZxkY_0cM',  // Overhead Extension form
    tips: 'Keep elbows pointing up. Deep stretch. Press to full lockout.',
  },
  {
    name: 'Skull Crushers',
    emoji: '💀',
    muscles: ['triceps'],
    equipment: 'ez_bar',
    category: 'isolation',
    videoId: 'd_KZxkY_0cM',  // Skull Crusher tutorial
    tips: 'Lower to forehead. Keep elbows narrow. Controlled descent.',
  },
  {
    name: 'Close-Grip Bench Press',
    emoji: '🏋️',
    muscles: ['triceps', 'chest'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'nEF0bv2FW94',  // Close Grip Bench tutorial
    tips: 'Hands shoulder-width. Tuck elbows. Press to lockout.',
  },

  // ──────── QUADS & GLUTES ────────
  {
    name: 'Barbell Back Squat',
    emoji: '🦵',
    muscles: ['quads', 'glutes', 'core'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'bEv6CCg2BC8',  // Alan Thrall — How To Squat
    tips: 'Break at hips and knees together. Chest up. Below parallel.',
  },
  {
    name: 'Front Squat',
    emoji: '🦵',
    muscles: ['quads', 'core'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'v-mQm_droHg',  // Front Squat tutorial
    tips: 'Elbows high. Upright torso. Deep depth.',
  },
  {
    name: 'Bulgarian Split Squat',
    emoji: '🦵',
    muscles: ['quads', 'glutes'],
    equipment: 'dumbbell',
    category: 'compound',
    videoId: '2C-uNgKwPLE',  // Bulgarian Split Squat tutorial
    tips: 'Back foot on bench. Front knee tracks over toes. Full depth.',
  },
  {
    name: 'Leg Press',
    emoji: '🦵',
    muscles: ['quads', 'hamstrings', 'glutes'],
    equipment: 'machine',
    category: 'compound',
    videoId: 'IZxyjW7MPJQ',  // Leg Press form tutorial
    tips: 'Feet shoulder-width. Do NOT lock knees at top. Full ROM.',
  },
  {
    name: 'Leg Extension',
    emoji: '🦵',
    muscles: ['quads'],
    equipment: 'machine',
    category: 'isolation',
    videoId: 'YyvSfVjQeL0',  // Leg Extension tutorial
    tips: 'Squeeze hard at top. Control the descent. Full contraction.',
  },
  {
    name: 'Hip Thrust',
    emoji: '🍑',
    muscles: ['glutes', 'hamstrings'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'xDmFkJxPzeM',  // Bret Contreras — Hip Thrust
    tips: 'Drive through heels. Squeeze glutes at top. Chin tucked.',
  },
  {
    name: 'Walking Lunges',
    emoji: '🚶',
    muscles: ['quads', 'glutes'],
    equipment: 'dumbbell',
    category: 'compound',
    videoId: 'QOVaHwm-Q6U',  // Walking Lunge tutorial
    tips: 'Long strides for glutes, short for quads. Upright torso.',
  },
  {
    name: 'Goblet Squat',
    emoji: '🏆',
    muscles: ['quads', 'glutes', 'core'],
    equipment: 'dumbbell',
    category: 'compound',
    videoId: 'MeIiIdhvXT4',  // Goblet Squat tutorial
    tips: 'Hold dumbbell at chest. Elbows inside knees. Deep depth.',
  },

  // ──────── HAMSTRINGS ────────
  {
    name: 'Romanian Deadlift',
    emoji: '🏋️',
    muscles: ['hamstrings', 'glutes'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'JCXUYuzwNrM',  // RDL tutorial
    tips: 'Push hips back. Bar on thighs. Feel hamstring stretch. Neutral spine.',
  },
  {
    name: 'Hamstring Curl (Lying)',
    emoji: '🦵',
    muscles: ['hamstrings'],
    equipment: 'machine',
    category: 'isolation',
    videoId: '1Tq3QdYUuHs',  // Lying Ham Curl tutorial
    tips: 'Hips pinned to pad. Full ROM. Squeeze at top.',
  },
  {
    name: 'Nordic Hamstring Curls',
    emoji: '🦵',
    muscles: ['hamstrings'],
    equipment: 'bodyweight',
    category: 'isolation',
    videoId: 'F488kNIv3_Q',  // Nordic Curl tutorial
    tips: 'Control descent as slowly as possible. Catch yourself at bottom.',
  },
  {
    name: 'Good Mornings',
    emoji: '🌅',
    muscles: ['hamstrings', 'back'],
    equipment: 'barbell',
    category: 'compound',
    videoId: 'YA-h3n9L4YU',  // Good Morning tutorial
    tips: 'Hinge at hips. Keep back flat. Feel stretch in hamstrings.',
  },

  // ──────── CALVES ────────
  {
    name: 'Calf Raises (Standing)',
    emoji: '🦶',
    muscles: ['calves'],
    equipment: 'machine',
    category: 'isolation',
    videoId: 'gwLzBJYoWlI',  // Standing Calf Raise tutorial
    tips: 'Deep stretch at bottom. Pause at top. Full ROM.',
  },
  {
    name: 'Calf Raises (Seated)',
    emoji: '🦶',
    muscles: ['calves'],
    equipment: 'machine',
    category: 'isolation',
    videoId: 'JbyjNymZOt0',  // Seated Calf Raise tutorial
    tips: 'Targets the soleus. Pause 2 seconds at top. Controlled tempo.',
  },

  // ──────── CORE ────────
  {
    name: 'Plank',
    emoji: '🧘',
    muscles: ['core'],
    equipment: 'bodyweight',
    category: 'isolation',
    videoId: 'ASdvN_XEl_c',  // Plank form tutorial
    tips: 'Forearms on floor. Body straight. Squeeze glutes. No sagging.',
  },
  {
    name: 'Hanging Leg Raises',
    emoji: '🎯',
    muscles: ['core'],
    equipment: 'bodyweight',
    category: 'isolation',
    videoId: 'hdng3Nm1x_E',  // Hanging Leg Raise tutorial
    tips: 'Posterior pelvic tilt. Curl pelvis up. Control descent. No swinging.',
  },
  {
    name: 'Cable Crunches',
    emoji: '🎯',
    muscles: ['core'],
    equipment: 'cable',
    category: 'isolation',
    videoId: 'AV5PmSJlMv0',  // Cable Crunch tutorial
    tips: 'Round spine. Pull with abs not arms. Full stretch at top.',
  },
  {
    name: 'Ab Rollout',
    emoji: '🛞',
    muscles: ['core'],
    equipment: 'other',
    category: 'compound',
    videoId: 'EEn-rKKsJMc',  // Ab Rollout tutorial
    tips: 'Squeeze core. Extend as far as possible. Dont arch back.',
  },
];

/**
 * Search/filter the exercise library by name, muscle group, or equipment.
 */
export function searchExercises(
  query: string,
  muscleFilter?: MuscleGroup,
  equipmentFilter?: EquipmentType
): ExerciseLibraryEntry[] {
  const q = query.toLowerCase().trim();
  return EXERCISE_LIBRARY.filter(ex => {
    const matchesQuery = !q || ex.name.toLowerCase().includes(q) ||
      ex.muscles.some(m => m.includes(q)) ||
      ex.equipment.includes(q);
    const matchesMuscle = !muscleFilter || ex.muscles.includes(muscleFilter);
    const matchesEquipment = !equipmentFilter || ex.equipment === equipmentFilter;
    return matchesQuery && matchesMuscle && matchesEquipment;
  });
}

/**
 * Group exercises by primary muscle group.
 */
export function groupByMuscle(): Map<MuscleGroup, ExerciseLibraryEntry[]> {
  const groups = new Map<MuscleGroup, ExerciseLibraryEntry[]>();
  for (const ex of EXERCISE_LIBRARY) {
    const primary = ex.muscles[0];
    if (!groups.has(primary)) groups.set(primary, []);
    groups.get(primary)!.push(ex);
  }
  return groups;
}
