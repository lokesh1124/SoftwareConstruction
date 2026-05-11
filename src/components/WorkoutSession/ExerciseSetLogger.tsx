// ─────────────────────────────────────────────────────────────
// MyFitAI — Exercise Set Logger
// One-tap set logging with ghost values, PR detection, swipe-to-skip
// Design: large tap targets, weight/reps inputs dominate
// ─────────────────────────────────────────────────────────────

import { useState, useRef } from 'react';
import type { LoggedSet, SetType } from '../../types/workout';

interface GhostValue {
  reps: number;
  weight: number;
  rpe: number;
}

interface ExerciseSetLoggerProps {
  exerciseIdx: number;
  exerciseName: string;
  thumbnailEmoji?: string;
  sets: LoggedSet[];
  ghostValues: GhostValue[];
  restSeconds: number;
  onLogSet: (exerciseIdx: number, setIdx: number, set: LoggedSet) => void;
  onAddSet: (exerciseIdx: number) => void;
  onRemoveSet: (exerciseIdx: number, setIdx: number) => void;
  onSetComplete: (exerciseIdx: number, setIdx: number) => void;
  onStartRest: (seconds: number) => void;
  prMap?: Map<string, boolean>;  // setIdx key → is PR
  exerciseId: string;
  checkPR?: (exerciseId: string, exerciseName: string, weight: number, reps: number, sessionId: string) => unknown;
  sessionId?: string;
}

const SET_TYPE_LABELS: Record<SetType, { label: string; short: string; color: string }> = {
  normal:  { label: 'Normal',  short: 'N', color: 'text-on-surface' },
  warmup:  { label: 'Warm-up', short: 'W', color: 'text-[#60A5FA]' },
  drop:    { label: 'Drop',    short: 'D', color: 'text-[#FBBF24]' },
  amrap:   { label: 'AMRAP',   short: 'A', color: 'text-[#6FFB85]' },
  failure: { label: 'Failure', short: 'F', color: 'text-error' },
};

export default function ExerciseSetLogger({
  exerciseIdx,
  exerciseName,
  thumbnailEmoji,
  sets,
  ghostValues,
  restSeconds,
  onLogSet,
  onAddSet,
  onRemoveSet,
  onSetComplete,
  onStartRest,
}: ExerciseSetLoggerProps) {
  const [expandedSetType, setExpandedSetType] = useState<number | null>(null);
  const swipeRef = useRef<{ startX: number; idx: number } | null>(null);
  const [swipedIdx, setSwipedIdx] = useState<number | null>(null);

  const handleInputChange = (
    setIdx: number,
    field: 'weight' | 'reps' | 'rpe',
    value: string
  ) => {
    const numVal = parseFloat(value) || 0;
    const current = sets[setIdx];
    onLogSet(exerciseIdx, setIdx, { ...current, [field]: numVal });
  };

  const handleSetTypeChange = (setIdx: number, type: SetType) => {
    const current = sets[setIdx];
    onLogSet(exerciseIdx, setIdx, { ...current, setType: type });
    setExpandedSetType(null);
  };

  const handleComplete = (setIdx: number) => {
    const current = sets[setIdx];
    if (current.completed) return;

    const ghost = ghostValues[setIdx];
    const finalSet: LoggedSet = {
      ...current,
      reps: current.reps || ghost?.reps || 0,
      weight: current.weight || ghost?.weight || 0,
      rpe: current.rpe || ghost?.rpe || 0,
      completed: true,
      timestamp: new Date().toISOString(),
    };

    onLogSet(exerciseIdx, setIdx, finalSet);
    onSetComplete(exerciseIdx, setIdx);

    // Auto-start rest timer
    if (restSeconds > 0) {
      onStartRest(restSeconds);
    }

    // Haptic
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleSkip = (setIdx: number) => {
    const current = sets[setIdx];
    onLogSet(exerciseIdx, setIdx, { ...current, skipped: true, completed: true, timestamp: new Date().toISOString() });
    setSwipedIdx(null);
  };

  // Touch swipe handlers
  const handleTouchStart = (idx: number, e: React.TouchEvent) => {
    swipeRef.current = { startX: e.touches[0].clientX, idx };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeRef.current) return;
    const deltaX = e.changedTouches[0].clientX - swipeRef.current.startX;
    if (deltaX < -60) {
      setSwipedIdx(swipeRef.current.idx);
    } else {
      setSwipedIdx(null);
    }
    swipeRef.current = null;
  };

  const completedCount = sets.filter(s => s.completed && !s.skipped).length;
  const totalSets = sets.length;

  return (
    <div className="bg-[var(--color-surface-container)] rounded-2xl border border-white/[0.04] overflow-hidden animate-card-enter">
      {/* Exercise Header */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Left accent + emoji */}
          <div className="flex-shrink-0 w-1 h-10 bg-primary rounded-full" />
          <span className="text-2xl flex-shrink-0">{thumbnailEmoji || '🏋️'}</span>
          <div className="min-w-0">
            <h3 className="font-headline font-extrabold text-base text-on-surface truncate tracking-tight">
              {exerciseName}
            </h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.15em] font-semibold mt-0.5">
              {completedCount}/{totalSets} Sets · {restSeconds}s Rest
            </p>
          </div>
        </div>
      </div>

      {/* Set Rows */}
      <div className="px-3 pb-3 space-y-1.5">
        {/* Column headers */}
        <div className="grid grid-cols-[36px_1fr_1fr_56px_40px] gap-2 px-2 pb-1">
          <span className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Set</span>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Weight</span>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Reps</span>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold text-center">RPE</span>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold text-center">✓</span>
        </div>

        {sets.map((set, setIdx) => {
          const ghost = ghostValues[setIdx];
          const isCompleted = set.completed;
          const isSkipped = set.skipped;
          const isSwiped = swipedIdx === setIdx;
          const typeInfo = SET_TYPE_LABELS[set.setType];

          return (
            <div
              key={setIdx}
              className="relative overflow-hidden rounded-xl"
              onTouchStart={(e) => handleTouchStart(setIdx, e)}
              onTouchEnd={handleTouchEnd}
            >
              {/* Swipe action */}
              {isSwiped && !isCompleted && (
                <div className="absolute inset-0 flex items-center justify-end pr-3 bg-error/10 z-10">
                  <button
                    onClick={() => handleSkip(setIdx)}
                    className="px-3 py-1.5 bg-error text-white text-[10px] font-bold uppercase tracking-widest rounded-lg active:scale-95"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => onRemoveSet(exerciseIdx, setIdx)}
                    className="px-3 py-1.5 bg-[var(--color-surface-container-highest)] text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-lg ml-2 active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              )}

              <div
                className={`grid grid-cols-[36px_1fr_1fr_56px_40px] gap-2 items-center px-2 py-2 rounded-xl transition-all ${
                  isSkipped
                    ? 'bg-error/5 opacity-40'
                    : isCompleted
                    ? 'bg-[var(--color-surface-container-high)] opacity-70'
                    : 'bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-high)]'
                } ${isSwiped ? 'translate-x-[-120px]' : 'translate-x-0'}`}
                style={{ transition: 'transform 0.2s ease-out, opacity 0.2s' }}
              >
                {/* Set number + type */}
                <button
                  onClick={() => setExpandedSetType(expandedSetType === setIdx ? null : setIdx)}
                  className={`text-center text-xs font-black ${typeInfo.color} w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.03] active:scale-90 transition-transform`}
                  disabled={isCompleted}
                >
                  {isSkipped ? '—' : typeInfo.short}
                </button>

                {/* Weight input */}
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={set.weight || ''}
                    placeholder={ghost?.weight?.toString() || '0'}
                    onChange={(e) => handleInputChange(setIdx, 'weight', e.target.value)}
                    disabled={isCompleted}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-bold text-on-surface text-center outline-none focus:border-primary/50 placeholder:text-on-surface-variant/30 disabled:opacity-50 tabular-nums"
                  />
                </div>

                {/* Reps input */}
                <div className="relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={set.reps || ''}
                    placeholder={ghost?.reps?.toString() || '0'}
                    onChange={(e) => handleInputChange(setIdx, 'reps', e.target.value)}
                    disabled={isCompleted}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm font-bold text-on-surface text-center outline-none focus:border-primary/50 placeholder:text-on-surface-variant/30 disabled:opacity-50 tabular-nums"
                  />
                </div>

                {/* RPE */}
                <select
                  value={set.rpe || ''}
                  onChange={(e) => handleInputChange(setIdx, 'rpe', e.target.value)}
                  disabled={isCompleted}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-1 py-2 text-xs font-bold text-on-surface text-center outline-none focus:border-primary/50 disabled:opacity-50 appearance-none"
                >
                  <option value="">—</option>
                  {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>

                {/* Complete button */}
                <button
                  onClick={() => handleComplete(setIdx)}
                  disabled={isCompleted}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 mx-auto ${
                    isCompleted
                      ? 'bg-[#6FFB85]/20 text-[#6FFB85]'
                      : 'bg-white/[0.03] text-on-surface-variant hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]" style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>
              </div>

              {/* Set type picker dropdown */}
              {expandedSetType === setIdx && !isCompleted && (
                <div className="flex gap-1.5 px-2 py-2 bg-[var(--color-surface-container-high)] rounded-b-xl animate-in fade-in duration-200">
                  {(Object.entries(SET_TYPE_LABELS) as [SetType, typeof SET_TYPE_LABELS[SetType]][]).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => handleSetTypeChange(setIdx, type)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
                        set.setType === type
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-white/[0.03] text-on-surface-variant hover:bg-white/[0.06]'
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Add Set */}
        <button
          onClick={() => onAddSet(exerciseIdx)}
          className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.08] text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
          Add Set
        </button>
      </div>
    </div>
  );
}
