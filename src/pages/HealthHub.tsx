import { useFitnessContext } from '../context/FitnessContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function HealthHub() {
  const { dailyStats, profile } = useFitnessContext();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-8 pb-32">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-secondary font-label font-bold tracking-widest uppercase text-[10px] mb-2">Diagnostic Scan</p>
            <h1 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tighter leading-none">RECOVERY HUB</h1>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-surface-container-low)] p-2 rounded-xl">
            <button onClick={() => showToast('Front Anatomy View Selected', 'info')} className="px-6 py-2 rounded-lg bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-tight transition-all active:scale-95">Front</button>
            <button onClick={() => showToast('Back Anatomy View Selected', 'info')} className="px-6 py-2 rounded-lg text-white/40 font-headline font-bold text-xs uppercase tracking-tight hover:text-white/80 transition-all active:scale-95">Back</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Central Anatomical Model Section */}
        <section className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[600px] bg-[var(--color-surface-container-low)] rounded-[2rem] overflow-hidden group">
          {/* Technical Grid Background Decor */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #FF7A00 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
          
          {/* The 3D-styled Anatomical Figure */}
          <div className="relative z-10 w-full max-w-md aspect-[3/5] flex items-center justify-center">
            <img alt="Anatomical Muscle Model" className="w-full h-full object-contain mix-blend-lighten opacity-80 brightness-75" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMjw_TGwMn52EmOmMxrxmmB626-1WY5O3U0ND0hUvIowWdefd0ecNlU8ziyyNbs63jrdw2HJxEs68hg7VPIfXHyIJbteJNrj5db_T5SgEoHCHuo9OtZlxrIIUgWSaAAWhOnUavuqeOXzgd-NJbNYf--qn7Ika5icrvvo4yidfwidFptu1kbqU6Etpenfwwqdn2RQp4tkYjaZTd4_Fw8tPibxWDiJLKrfQf0W3d4_Gx2VxXk3Np-7xSSEUBVMuB0tqJ5cI3r2wokXXT"/>
            {/* Muscle Hotspots */}
            <div className="absolute top-[18%] left-[45%] w-12 h-12 rounded-full bg-error/40 drop-shadow-[0_0_8px_#ff716c44] border border-error animate-pulse cursor-pointer"></div>
            <div className="absolute top-[35%] left-[30%] w-10 h-16 rounded-full bg-secondary/30 drop-shadow-[0_0_8px_#6ffb8544] border border-secondary cursor-pointer"></div>
            <div className="absolute top-[35%] right-[30%] w-10 h-16 rounded-full bg-secondary/30 drop-shadow-[0_0_8px_#6ffb8544] border border-secondary cursor-pointer"></div>
            <div className="absolute top-[55%] left-[35%] w-14 h-24 rounded-full bg-[#fab0ff]/40 drop-shadow-[0_0_8px_#f39cfb44] border border-[#fab0ff] cursor-pointer"></div>
            <div className="absolute top-[55%] right-[35%] w-14 h-24 rounded-full bg-[#fab0ff]/40 drop-shadow-[0_0_8px_#f39cfb44] border border-[#fab0ff] cursor-pointer"></div>
          </div>

          {/* Muscle Info Floating Card */}
          <div className="absolute bottom-8 left-8 right-8 z-20">
            <div className="bg-[#19191c]/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-error)]/20 flex items-center justify-center text-[var(--color-error)] border border-[var(--color-error)]/30">
                <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>fitness_center</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-headline font-bold text-xl tracking-tight">Pectoralis Major</h3>
                  <span className="px-3 py-1 rounded-full bg-[#9f0519] text-[#ffa8a3] font-label font-bold text-[10px] uppercase">Critical Fatigue</span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-white/40 font-label text-[10px] uppercase tracking-widest">State</p>
                    <p className="text-white font-body font-semibold text-sm">Muscle Tears Detected</p>
                  </div>
                  <div className="border-l border-white/10 pl-4">
                    <p className="text-white/40 font-label text-[10px] uppercase tracking-widest">Last Trained</p>
                    <p className="text-white font-body font-semibold text-sm">14h ago (Hypertrophy)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="absolute top-8 right-8 flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-[var(--color-surface-container)]/40 backdrop-blur px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></div>
              <span className="text-[10px] font-bold text-white/60 font-label uppercase">Optimal</span>
            </div>
            <div className="flex items-center gap-3 bg-[var(--color-surface-container)]/40 backdrop-blur px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[var(--color-tertiary)]"></div>
              <span className="text-[10px] font-bold text-white/60 font-label uppercase">Recovering</span>
            </div>
            <div className="flex items-center gap-3 bg-[var(--color-surface-container)]/40 backdrop-blur px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[var(--color-error)]"></div>
              <span className="text-[10px] font-bold text-white/60 font-label uppercase">Strained</span>
            </div>
          </div>
        </section>

        {/* Sidebar Health Metrics Section */}
        <aside className="lg:col-span-5 space-y-6">
          <h2 className="font-headline font-bold text-lg tracking-tight text-white/80 px-2">HEALTH METRICS</h2>
          
          {/* Sleep Metric Card */}
          <div className="bg-[var(--color-surface-container)] rounded-3xl p-6 transition-all hover:bg-[var(--color-surface-container-high)] group">
              <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">bedtime</span>
                </div>
                <div>
                  <p className="text-white/40 font-label text-[10px] uppercase tracking-widest">Sleep Quality</p>
                  <p className="text-white font-headline font-bold text-xl tracking-tight">{Math.min(100, Math.round((dailyStats.sleep / 8) * 100))}% Recovery</p>
                </div>
              </div>
              <span className="text-secondary font-label font-bold text-xs">+12% vs Avg</span>
            </div>
            {/* Simple Trend Sparkline */}
            <div className="h-16 flex items-end gap-1.5 px-1">
              <div className="flex-1 bg-primary/20 rounded-t h-[40%] group-hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t h-[60%] group-hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t h-[55%] group-hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t h-[85%] group-hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t h-[45%] group-hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary/20 rounded-t h-[90%] group-hover:bg-primary/40 transition-colors"></div>
              <div className="flex-1 bg-primary rounded-t h-full"></div>
            </div>
          </div>

          {/* Hydration & RHR Metrics Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Hydration */}
            <div className="bg-[var(--color-surface-container)] rounded-3xl p-6 flex flex-col justify-between aspect-square">
              <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
              <div>
                <p className="font-headline font-black text-3xl tracking-tighter text-white">{dailyStats.water.toFixed(1)}<span className="text-sm font-label text-white/40 ml-1">L</span></p>
                <p className="text-white/40 font-label text-[10px] uppercase tracking-widest mt-1">Hydration</p>
              </div>
              <div className="w-full bg-[#252528] h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all" style={{width: `${Math.min(100, (dailyStats.water / profile.dailyWaterGoal) * 100)}%`}}></div>
              </div>
            </div>
            
            {/* Resting Heart Rate */}
            <div className="bg-[var(--color-surface-container)] rounded-3xl p-6 flex flex-col justify-between aspect-square relative overflow-hidden">
              <span className="material-symbols-outlined text-[#ff716c] text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
              <div className="relative z-10">
                <p className="font-headline font-black text-3xl tracking-tighter text-white">52<span className="text-sm font-label text-white/40 ml-1">BPM</span></p>
                <p className="text-white/40 font-label text-[10px] uppercase tracking-widest mt-1">Avg RHR</p>
              </div>
              {/* Subsurface Pulse Effect */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#ff716c]/5 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Recovery Score Card */}
          <div className="bg-gradient-to-br from-[var(--color-secondary)]/10 to-transparent p-8 rounded-[2rem] border border-[var(--color-secondary)]/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-2xl tracking-tight">Daily Readiness</h3>
              <div className="w-16 h-16 relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#252528" strokeWidth="3"></path>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6FFB85" strokeDasharray="92, 100" strokeWidth="3"></path>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-headline font-black text-sm text-white">92</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">Your nervous system is prime for peak intensity today. Muscle inflammation is localized to the chest region.</p>
            <button onClick={() => navigate('/workout')} className="w-full bg-[var(--color-secondary)] text-[#004818] font-headline font-extrabold py-4 rounded-2xl uppercase tracking-wider text-sm transition-all hover:brightness-110 active:scale-95 shadow-[0_8px_32px_rgba(111,251,133,0.2)]">Generate Recovery Routine</button>
          </div>
        </aside>
      </div>
    </main>
  );
}
