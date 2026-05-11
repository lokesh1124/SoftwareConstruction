// ─────────────────────────────────────────────────────────────
// MyFitAI — Session Card (compact history card)
// ─────────────────────────────────────────────────────────────

import type { WorkoutSession } from '../../types/workout';
import { formatDuration, formatVolume } from '../../types/workout';

interface SessionCardProps {
  session: WorkoutSession;
  onTap: (id: string) => void;
  onDelete: (id: string) => void;
}

function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return d.toLocaleDateString('en-US', { weekday: 'long' });
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function SessionCard({ session, onTap, onDelete }: SessionCardProps) {
  const hasPRs = session.prsHit.length > 0;

  return (
    <div
      onClick={() => onTap(session.id)}
      className="bg-[var(--color-surface-container)] rounded-2xl border border-white/[0.04] p-4 cursor-pointer hover:bg-[var(--color-surface-container-high)] transition-all active:scale-[0.98] group relative"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-headline font-bold text-sm text-on-surface truncate">{session.templateName}</h4>
            {hasPRs && (
              <span className="bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[10px]">emoji_events</span>
                {session.prsHit.length} PR{session.prsHit.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{relativeDate(session.startedAt)}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant/0 group-hover:text-on-surface-variant/50 hover:text-error hover:bg-error/10 transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[14px]">delete</span>
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">timer</span>
          {formatDuration(session.duration)}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">fitness_center</span>
          {formatVolume(session.totalVolume)} lbs
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">repeat</span>
          {session.totalSets} sets
        </span>
      </div>

      {/* Muscle badges */}
      {session.musclesWorked.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {session.musclesWorked.slice(0, 4).map(m => (
            <span key={m} className="text-[8px] uppercase tracking-wider bg-white/[0.03] text-on-surface-variant px-1.5 py-0.5 rounded font-semibold">{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}
