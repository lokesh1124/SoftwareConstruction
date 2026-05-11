
import { useFitnessContext } from '../context/FitnessContext';
import { useToast } from '../context/ToastContext';

export default function Reports() {
  const { profile, activities } = useFitnessContext();
  const { showToast } = useToast();

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8 pb-32 space-y-10">
      <header className="mb-12">
        <p className="text-secondary font-label font-bold tracking-widest uppercase text-[10px] mb-2">Performance Analytics</p>
        <h1 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tighter leading-none">SYSTEM REPORTS</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">query_stats</span>
            <h2 className="font-headline text-2xl font-bold">Weekly Overview</h2>
          </div>
          <p className="text-on-surface-variant text-sm border-l-2 border-primary pl-4">
            You burned an average of 420 kcal more than last week. Your compliance to the {profile.goal} protocol is at 88%.
          </p>
          
          <div className="h-48 flex items-end justify-between gap-2 pt-8">
            {/* Simple mock bar chart */}
            {[450, 600, 300, 800, 500, 650, 400].map((val, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group transition-colors hover:bg-primary/40" style={{ height: `${(val/800)*100}%` }}>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary text-3xl">psychology</span>
              <h2 className="font-headline text-2xl font-bold">AI Insights</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-[#FF716C] mt-0.5">warning</span>
                <div>
                  <p className="font-headline font-bold text-sm">Sleep Debt Detected</p>
                  <p className="text-xs text-on-surface-variant mt-1">Average sleep duration this week is 6.2 hours. Sub-optimal for hypertrophy recovery.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-secondary mt-0.5">trending_up</span>
                <div>
                  <p className="font-headline font-bold text-sm">Strength Progression</p>
                  <p className="text-xs text-on-surface-variant mt-1">Bench press volume has increased by 5% week over week.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <button onClick={() => showToast('PDF Report Exported to Downloads', 'success')} className="w-full mt-4 py-4 rounded-xl border border-primary/30 text-primary font-headline font-bold uppercase tracking-widest text-sm hover:bg-primary/10 transition-colors">
            Export Full PDF Report
          </button>
        </div>
      </section>
      
      {/* Activity Log History Viewer */}
      <section className="bg-[var(--color-surface-container)] rounded-[2rem] p-8">
        <h2 className="font-headline text-xl font-bold mb-6">Recent Activity Log</h2>
        {activities.length === 0 ? (
          <p className="text-on-surface-variant text-sm py-4">No activities logged yet.</p>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map(act => (
              <div key={act.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-sm">
                      {act.type === 'Workout' ? 'fitness_center' : act.type === 'Steps' ? 'steps' : act.type === 'Water' ? 'water_drop' : 'bedtime'}
                    </span>
                  </div>
                  <div>
                    <p className="font-headline font-bold">{act.type}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{new Date(act.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold text-lg">{act.value} <span className="text-xs text-on-surface-variant">units</span></p>
                  {act.caloriesBurned && <p className="text-[10px] text-primary font-bold">{act.caloriesBurned} KCAL</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
