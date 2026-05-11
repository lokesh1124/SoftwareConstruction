// ─────────────────────────────────────────────────────────────
// MyFitAI — Program Builder
// Weekly schedule grid: assign templates to days of the week
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useWorkoutBuilder } from '../context/WorkoutBuilderContext';
import { db } from '../utils/db';
import type { Program, DaySlot, WeekSchedule } from '../types/program';
import { DAY_LABELS_FULL } from '../types/program';

interface ProgramBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_WEEK: DaySlot[] = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i,
  isRest: true,
  label: i === 0 || i === 6 ? 'Rest' : 'Rest',
}));

export default function ProgramBuilder({ isOpen, onClose }: ProgramBuilderProps) {
  const { templates } = useWorkoutBuilder();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [name, setName] = useState('');
  const [weeks, setWeeks] = useState(4);
  const [schedule, setSchedule] = useState<DaySlot[]>([...EMPTY_WEEK]);
  const [selectingDay, setSelectingDay] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      db.programs.getAll().then(setPrograms).catch(console.error);
    }
  }, [isOpen]);

  const assignTemplate = (dayIdx: number, templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    const next = [...schedule];
    next[dayIdx] = { ...next[dayIdx], templateId, templateName: template.name, isRest: false, label: template.name };
    setSchedule(next);
    setSelectingDay(null);
  };

  const markRest = (dayIdx: number) => {
    const next = [...schedule];
    next[dayIdx] = { ...next[dayIdx], templateId: undefined, templateName: undefined, isRest: true, label: 'Rest' };
    setSchedule(next);
    setSelectingDay(null);
  };

  const handleSave = async () => {
    const weekSchedule: WeekSchedule[] = Array.from({ length: weeks }, (_, i) => ({
      weekNumber: i + 1,
      days: schedule,
    }));
    const program: Program = {
      id: crypto.randomUUID(),
      name: name || 'My Program',
      description: '',
      goal: 'general_fitness',
      durationWeeks: weeks,
      daysPerWeek: schedule.filter(d => !d.isRest).length,
      difficulty: 'all_levels',
      schedule: weekSchedule,
      isActive: true,
      currentWeek: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Deactivate other programs
    for (const p of programs) {
      if (p.isActive) await db.programs.save({ ...p, isActive: false });
    }
    await db.programs.save(program);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--color-surface)] w-full max-w-md mx-auto h-[80vh] rounded-t-[2rem] border-t border-white/[0.06] flex flex-col p-5 animate-slide-up">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />
        <h3 className="font-headline font-extrabold text-lg mb-1">Create Program</h3>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-5">Weekly schedule</p>

        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Program name..."
          className="w-full bg-[var(--color-surface-container)] border border-white/[0.04] rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary/30 mb-4" />

        {/* Duration selector */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Duration</span>
          <div className="flex gap-1.5">
            {[4, 6, 8, 12].map(w => (
              <button key={w} onClick={() => setWeeks(w)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                  weeks === w ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-white/[0.03] text-on-surface-variant border border-white/[0.04]'
                }`}>
                {w}wk
              </button>
            ))}
          </div>
        </div>

        {/* Weekly grid */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {schedule.map((day, idx) => (
            <button key={idx} onClick={() => setSelectingDay(idx)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                day.isRest
                  ? 'bg-white/[0.02] border-white/[0.03] text-on-surface-variant'
                  : 'bg-[var(--color-surface-container)] border-primary/20'
              }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider w-8 text-on-surface-variant/50">{DAY_LABELS_FULL[idx].slice(0, 3)}</span>
              <div className="flex-1 text-left">
                <p className={`text-sm font-bold ${day.isRest ? 'text-on-surface-variant/50' : 'text-on-surface'}`}>
                  {day.isRest ? 'Rest Day' : day.label}
                </p>
              </div>
              {!day.isRest && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              <span className="material-symbols-outlined text-on-surface-variant/30 text-[16px]">chevron_right</span>
            </button>
          ))}
        </div>

        {/* Save button */}
        <button onClick={handleSave}
          className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-transform mt-4">
          Save Program
        </button>

        {/* Template picker */}
        {selectingDay !== null && (
          <div className="absolute inset-x-0 bottom-0 bg-[var(--color-surface)] rounded-t-[2rem] border-t border-white/[0.06] p-5 max-h-[60vh] flex flex-col animate-slide-up">
            <h4 className="font-headline font-bold text-sm mb-3">
              Assign to {DAY_LABELS_FULL[selectingDay]}
            </h4>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              <button onClick={() => markRest(selectingDay)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.03] text-on-surface-variant active:scale-[0.98]">
                <span className="material-symbols-outlined text-[18px]">hotel</span>
                <span className="text-sm font-bold">Rest Day</span>
              </button>
              {templates.map(t => (
                <button key={t.id} onClick={() => assignTemplate(selectingDay, t.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-container)] border border-white/[0.04] hover:border-primary/20 active:scale-[0.98] transition-all">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-on-surface">{t.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{t.exercises.length} exercises</p>
                  </div>
                </button>
              ))}
              {templates.length === 0 && (
                <p className="text-center text-on-surface-variant text-sm py-8">No templates yet. Create a workout first.</p>
              )}
            </div>
            <button onClick={() => setSelectingDay(null)}
              className="w-full py-3 mt-3 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest active:scale-95">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
