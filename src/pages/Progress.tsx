import { useFitnessContext } from '../context/FitnessContext';
import { useGamification } from '../context/GamificationContext';
import { useState } from 'react';

export default function Progress() {
  const { profile, activities } = useFitnessContext();
  const { xp, level, levelTitle, xpProgress, achievements, weeklyMissions, streak, longestStreak } = useGamification();
  const [activeTab, setActiveTab] = useState<'overview' | 'strength' | 'body' | 'achievements'>('overview');

  // Mock weight data for chart
  const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'NOW'];

  // Heatmap data (last 12 weeks, 7 days each)
  const heatmapData: number[][] = Array.from({ length: 12 }, () =>
    Array.from({ length: 7 }, () => Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0)
  );

  // Strength progress mock data
  const strengthLifts = [
    { name: 'Bench Press', current: 185, previous: 165, unit: 'lbs', change: '+12%' },
    { name: 'Squat', current: 275, previous: 250, unit: 'lbs', change: '+10%' },
    { name: 'Deadlift', current: 315, previous: 295, unit: 'lbs', change: '+7%' },
    { name: 'OHP', current: 135, previous: 120, unit: 'lbs', change: '+12.5%' },
    { name: 'Barbell Row', current: 185, previous: 170, unit: 'lbs', change: '+9%' },
  ];

  // Body measurements mock
  const bodyMeasurements = [
    { label: 'Chest', value: '42"', trend: 'up' },
    { label: 'Waist', value: '32"', trend: 'down' },
    { label: 'Arms', value: '15.5"', trend: 'up' },
    { label: 'Thighs', value: '24"', trend: 'up' },
    { label: 'Body Fat', value: '14.2%', trend: 'down' },
    { label: 'Shoulders', value: '48"', trend: 'up' },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completedMissions = weeklyMissions.filter(m => m.completed).length;

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-32 space-y-6">
      {/* Header */}
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-[28px] tracking-tight">Progress</h1>
        </div>
        {/* XP Bar */}
        <div className="flex items-center gap-3 bg-[var(--color-surface-container)] rounded-xl px-4 py-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="font-headline font-bold text-primary text-sm">{level}</span>
          </div>
          <div className="min-w-[80px]">
            <div className="flex justify-between text-[10px] font-medium mb-1">
              <span className="text-primary">{levelTitle}</span>
              <span className="text-on-surface-variant">{xp} XP</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] pb-1">
        {(['overview', 'strength', 'body', 'achievements'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl font-semibold text-xs capitalize transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-primary text-black'
                : 'bg-[var(--color-surface-container)] text-on-surface-variant hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-5 border border-white/5 group hover:border-primary/30 transition-colors">
              <span className="material-symbols-outlined text-[#FF4D4D] text-2xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <p className="font-headline font-black text-3xl tracking-tighter">{streak}</p>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Day Streak</p>
            </div>
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-5 border border-white/5">
              <span className="material-symbols-outlined text-primary text-2xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
              <p className="font-headline font-black text-3xl tracking-tighter">{activities.filter(a => a.type === 'Workout').length}</p>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Total Workouts</p>
            </div>
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-5 border border-white/5">
              <span className="material-symbols-outlined text-secondary text-2xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
              <p className="font-headline font-black text-3xl tracking-tighter">{unlockedCount}</p>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Achievements</p>
            </div>
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-5 border border-white/5">
              <span className="material-symbols-outlined text-[#fab0ff] text-2xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <p className="font-headline font-black text-3xl tracking-tighter">{longestStreak}</p>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Best Streak</p>
            </div>
          </div>

          {/* Weight Trend Chart */}
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline font-bold text-xl">Weight Trend</h3>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_down</span> -5.5 lbs in 12 weeks
                </p>
              </div>
              <div className="text-right">
                <span className="font-headline font-black text-3xl tracking-tighter">{profile.weight}</span>
                <span className="text-[10px] text-on-surface-variant font-bold ml-1">LBS</span>
              </div>
            </div>
            <div className="h-40 relative">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wtGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#6FFB85" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#6FFB85" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <line stroke="#ffffff" strokeOpacity="0.03" x1="0" x2="800" y1="50" y2="50"></line>
                <line stroke="#ffffff" strokeOpacity="0.03" x1="0" x2="800" y1="100" y2="100"></line>
                <line stroke="#ffffff" strokeOpacity="0.03" x1="0" x2="800" y1="150" y2="150"></line>
                <path d="M0,40 C60,50 120,55 180,70 C240,85 300,60 360,75 C420,90 480,100 540,110 C600,120 660,130 720,140 L800,155" fill="transparent" stroke="#6FFB85" strokeWidth="3" strokeLinecap="round"></path>
                <path d="M0,40 C60,50 120,55 180,70 C240,85 300,60 360,75 C420,90 480,100 540,110 C600,120 660,130 720,140 L800,155 V200 H0 Z" fill="url(#wtGrad)"></path>
                <circle cx="800" cy="155" r="6" fill="#6FFB85"></circle>
                <circle cx="800" cy="155" r="12" fill="transparent" stroke="#6FFB85" strokeWidth="2" opacity="0.4"></circle>
              </svg>
            </div>
            <div className="flex justify-between mt-3 text-[9px] font-label font-bold text-white/30 uppercase tracking-[0.2em] px-2">
              {weekLabels.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>

          {/* Consistency Heatmap */}
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 border border-white/5">
            <h3 className="font-headline font-bold text-xl mb-6">Consistency Heatmap</h3>
            <div className="flex gap-1">
              {heatmapData.map((week, wi) => (
                <div key={wi} className="flex-1 flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={`aspect-square rounded-[3px] transition-colors ${
                        day === 0 ? 'bg-white/5' :
                        day === 1 ? 'bg-secondary/30' :
                        day === 2 ? 'bg-secondary/60' : 'bg-secondary shadow-[0_0_6px_rgba(111,251,133,0.3)]'
                      }`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4"><span className="text-[9px] text-on-surface-variant font-bold uppercase">Less</span>{[5, 30, 60, 100].map(o => <div key={o} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(111,251,133,${o/100})` }}></div>)}<span className="text-[9px] text-on-surface-variant font-bold uppercase">More</span></div>
          </div>

          {/* Weekly Missions */}
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-bold text-xl">Weekly Missions</h3>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{completedMissions}/{weeklyMissions.length} Done</span>
            </div>
            <div className="space-y-4">
              {weeklyMissions.map(m => (
                <div key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${m.completed ? 'bg-secondary/10 border-secondary/30' : 'bg-white/5 border-white/5'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.completed ? 'bg-secondary/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-headline font-bold text-sm ${m.completed ? 'line-through text-white/50' : ''}`}>{m.title}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{m.description}</p>
                    <div className="w-full h-1.5 bg-[#252528] rounded-full mt-2 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${m.completed ? 'bg-secondary' : 'bg-primary'}`} style={{ width: `${(m.current / m.target) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-primary">+{m.xpReward} XP</p>
                    <p className="text-[10px] text-on-surface-variant font-bold mt-1">{m.current}/{m.target}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'strength' && (
        <div className="space-y-8">
          {/* Strength Lifts */}
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 border border-white/5">
            <h3 className="font-headline font-bold text-xl mb-6">Strength Progress</h3>
            <div className="space-y-4">
              {strengthLifts.map((lift, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl group hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">fitness_center</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-headline font-bold">{lift.name}</p>
                    <div className="w-full h-1.5 bg-[#252528] rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-primary to-[#00c6ff] rounded-full" style={{ width: `${(lift.current / 400) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-black text-xl">{lift.current}<span className="text-xs text-on-surface-variant ml-1">{lift.unit}</span></p>
                    <p className="text-secondary text-[10px] font-bold">{lift.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1RM Calculator */}
          <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-[2rem] p-8 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">calculate</span>
              <h3 className="font-headline font-bold text-xl">1RM Calculator</h3>
            </div>
            <p className="text-on-surface-variant text-sm mb-6">Estimate your one-rep max based on your working sets.</p>
            <div className="grid grid-cols-3 gap-4">
              {strengthLifts.slice(0, 3).map((lift, i) => (
                <div key={i} className="bg-black/30 rounded-xl p-4 text-center border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{lift.name}</p>
                  <p className="font-headline font-black text-2xl text-primary mt-1">{Math.round(lift.current * 1.33)}</p>
                  <p className="text-[9px] text-on-surface-variant font-bold mt-0.5">EST 1RM</p>
                </div>
              ))}
            </div>
          </div>

          {/* Volume Tracker */}
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 border border-white/5">
            <h3 className="font-headline font-bold text-xl mb-6">Weekly Volume by Muscle</h3>
            <div className="space-y-3">
              {[
                { muscle: 'Chest', sets: 18, target: 20, color: '#FF4D4D' },
                { muscle: 'Back', sets: 22, target: 20, color: '#FF7A00' },
                { muscle: 'Shoulders', sets: 14, target: 16, color: '#fab0ff' },
                { muscle: 'Legs', sets: 20, target: 22, color: '#6FFB85' },
                { muscle: 'Arms', sets: 16, target: 14, color: '#00b4d8' },
                { muscle: 'Core', sets: 8, target: 10, color: '#ff9800' },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-20 text-xs font-bold uppercase tracking-wider">{m.muscle}</span>
                  <div className="flex-1 h-3 bg-[#252528] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (m.sets / m.target) * 100)}%`, backgroundColor: m.color }}></div>
                  </div>
                  <span className="text-xs font-bold w-16 text-right" style={{ color: m.sets >= m.target ? '#6FFB85' : m.color }}>{m.sets}/{m.target} sets</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'body' && (
        <div className="space-y-8">
          {/* Body Measurements */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bodyMeasurements.map((m, i) => (
              <div key={i} className="bg-[var(--color-surface-container)] rounded-2xl p-5 border border-white/5 group hover:border-primary/30 transition-colors">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">{m.label}</p>
                <div className="flex items-end justify-between">
                  <p className="font-headline font-black text-2xl tracking-tighter">{m.value}</p>
                  <span className={`material-symbols-outlined text-sm ${m.trend === 'up' ? 'text-secondary' : 'text-[#FF4D4D]'}`}>
                    {m.trend === 'up' ? 'trending_up' : 'trending_down'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Body Recomposition Predictor */}
          <div className="bg-gradient-to-br from-secondary/10 to-transparent rounded-[2rem] p-8 border border-secondary/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>query_stats</span>
              <h3 className="font-headline font-bold text-xl">Body Recomposition Predictor</h3>
            </div>
            <p className="text-on-surface-variant text-sm mb-6">Based on your current trajectory and consistency.</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-xl p-6 border border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Projected Weight (4 weeks)</p>
                <p className="font-headline font-black text-4xl text-secondary tracking-tighter">{(profile.weight - 3.5).toFixed(1)}</p>
                <p className="text-[9px] text-on-surface-variant font-bold mt-1">LBS</p>
              </div>
              <div className="bg-black/30 rounded-xl p-6 border border-white/5 text-center">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Projected Body Fat (4 weeks)</p>
                <p className="font-headline font-black text-4xl text-secondary tracking-tighter">12.8</p>
                <p className="text-[9px] text-on-surface-variant font-bold mt-1">%</p>
              </div>
            </div>
          </div>

          {/* Transformation Timeline */}
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-8 border border-white/5">
            <h3 className="font-headline font-bold text-xl mb-6">Transformation Timeline</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-white/10"></div>
              {[
                { date: 'Week 12', note: 'Goal weight in sight — down 5.5 lbs', color: '#6FFB85' },
                { date: 'Week 8', note: 'First visible abs definition', color: '#FF7A00' },
                { date: 'Week 4', note: 'Bench press PR: 185 lbs', color: '#ff9800' },
                { date: 'Week 1', note: 'Journey started — 182 lbs', color: '#fab0ff' },
              ].map((event, i) => (
                <div key={i} className="flex gap-4 items-start relative pl-12">
                  <div className="absolute left-4 w-4 h-4 rounded-full border-2" style={{ borderColor: event.color, backgroundColor: `${event.color}33` }}></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: event.color }}>{event.date}</p>
                    <p className="text-white text-sm font-medium mt-1">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-8">
          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(a => (
              <div key={a.id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                a.unlocked
                  ? 'bg-[var(--color-surface-container)] border-primary/30 shadow-[0_0_20px_rgba(255,122,0,0.1)]'
                  : 'bg-black/20 border-white/5 opacity-50 grayscale'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  a.unlocked ? 'bg-primary/20 text-primary' : 'bg-white/5 text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-2xl" style={a.unlocked ? { fontVariationSettings: "'FILL' 1" } : {}}>{a.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-headline font-bold text-sm">{a.title}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{a.description}</p>
                  {a.unlocked && <p className="text-[9px] text-primary font-bold mt-1">+{a.xpReward} XP Earned</p>}
                </div>
                {a.unlocked && <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
