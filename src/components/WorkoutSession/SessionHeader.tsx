// ─────────────────────────────────────────────────────────────
// MyFitAI — Session Header
// Sticky top bar during active workout: name, stopwatch, controls
// ─────────────────────────────────────────────────────────────

import { formatDuration } from '../../types/workout';

interface SessionHeaderProps {
  workoutName: string;
  elapsed: number;
  currentExercise: number;
  totalExercises: number;
  onEnd: () => void;
  onOpenPlateCalc: () => void;
}

export default function SessionHeader({
  workoutName,
  elapsed,
  currentExercise,
  totalExercises,
  onEnd,
  onOpenPlateCalc,
}: SessionHeaderProps) {
  return (
    <div className="sticky top-[52px] z-30 bg-[var(--color-header-bg)] backdrop-blur-xl border-b border-white/[0.04] px-5 py-3">
      <div className="flex items-center justify-between">
        {/* Left — Workout info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-headline font-extrabold text-sm tracking-wide uppercase truncate text-on-surface">
            {workoutName}
          </h2>
          <p className="text-[10px] text-on-surface-variant tracking-widest uppercase font-semibold mt-0.5">
            Exercise {currentExercise} / {totalExercises}
          </p>
        </div>

        {/* Center — Stopwatch */}
        <div className="flex-shrink-0 mx-4">
          <div className="bg-[var(--color-surface-container)] border border-white/[0.06] rounded-xl px-4 py-2 min-w-[96px] text-center">
            <span className="font-mono font-black text-xl tracking-tight text-on-surface tabular-nums">
              {formatDuration(elapsed)}
            </span>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenPlateCalc}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-surface-container)] text-on-surface-variant hover:text-on-surface hover:bg-[var(--color-surface-container-high)] transition-all active:scale-90"
            title="Plate Calculator"
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
          </button>
          <button
            onClick={onEnd}
            className="h-9 px-3 flex items-center justify-center rounded-xl bg-error/10 text-error border border-error/20 text-[11px] font-bold uppercase tracking-widest hover:bg-error/20 transition-all active:scale-95"
          >
            End
          </button>
        </div>
      </div>
    </div>
  );
}
