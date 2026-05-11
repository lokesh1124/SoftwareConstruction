// ─────────────────────────────────────────────────────────────
// MyFitAI — History Calendar (month grid with workout dots)
// ─────────────────────────────────────────────────────────────

import type { WorkoutSession } from '../../types/workout';

interface HistoryCalendarProps {
  sessions: WorkoutSession[];
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export default function HistoryCalendar({ sessions, currentMonth, onPrevMonth, onNextMonth, selectedDate, onSelectDate }: HistoryCalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];
  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Build workout-date map
  const workoutDates = new Map<string, number>();
  sessions.forEach(s => {
    const d = s.startedAt.split('T')[0];
    workoutDates.set(d, (workoutDates.get(d) || 0) + 1);
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-[var(--color-surface-container)] rounded-2xl border border-white/[0.04] p-4 mb-5">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <h3 className="font-headline font-bold text-sm tracking-tight">{monthLabel}</h3>
        <button onClick={onNextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-90 transition-all">
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-bold py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const count = workoutDates.get(dateStr) || 0;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <button key={i} onClick={() => onSelectDate(dateStr)}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all active:scale-90 ${
                isSelected ? 'bg-primary text-on-primary' : isToday ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-white/[0.04]'
              }`}>
              {day}
              {count > 0 && !isSelected && (
                <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isToday ? 'bg-primary' : 'bg-primary/60'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
