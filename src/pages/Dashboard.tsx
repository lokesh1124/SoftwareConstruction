import { useFitnessContext } from '../context/FitnessContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile, dailyStats } = useFitnessContext();
  const navigate = useNavigate();
  
  const movePrc = Math.min(100, Math.round((dailyStats.calories / profile.dailyCalorieGoal) * 100)) || 0;
  const exercisePrc = 42;
  const standPrc = 10;
  const overallPrc = Math.round((movePrc + exercisePrc + standPrc) / 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <main className="max-w-lg mx-auto px-5 pt-6 space-y-6 pb-4">
        
        {/* Greeting — simple, human, confident */}
        <section>
          <p className="text-on-surface-variant text-sm font-medium">{greeting},</p>
          <h1 className="font-headline font-extrabold text-[28px] tracking-tight mt-0.5">{profile.name}</h1>
        </section>

        {/* Activity Rings — hero card, single focus */}
        <section 
          onClick={() => navigate('/reports')} 
          className="bg-[var(--color-surface-container)] rounded-2xl p-6 cursor-pointer hover:bg-[var(--color-surface-container-high)] transition-colors"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-headline font-bold text-base">Activity</h2>
            <span className="text-on-surface-variant text-xs font-medium">Today</span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Rings */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                {/* Stand Ring (outer) */}
                <circle cx="64" cy="64" fill="transparent" r="56" stroke="var(--color-surface-container-highest)" strokeWidth="8" />
                <circle cx="64" cy="64" fill="transparent" r="56" stroke="#fab0ff" strokeDasharray="352" strokeDashoffset={`${Math.max(0, 352 - (352 * standPrc) / 100)}`} strokeLinecap="round" strokeWidth="8" opacity="0.8" />
                {/* Exercise Ring (middle) */}
                <circle cx="64" cy="64" fill="transparent" r="44" stroke="var(--color-surface-container-highest)" strokeWidth="8" />
                <circle cx="64" cy="64" fill="transparent" r="44" stroke="#6FFB85" strokeDasharray="276" strokeDashoffset={`${Math.max(0, 276 - (276 * exercisePrc) / 100)}`} strokeLinecap="round" strokeWidth="8" />
                {/* Move Ring (inner) */}
                <circle cx="64" cy="64" fill="transparent" r="32" stroke="var(--color-surface-container-highest)" strokeWidth="8" />
                <circle cx="64" cy="64" fill="transparent" r="32" stroke="var(--color-primary)" strokeDasharray="201" strokeDashoffset={`${Math.max(0, 201 - (201 * movePrc) / 100)}`} strokeLinecap="round" strokeWidth="8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline font-black text-2xl leading-none">{overallPrc}<span className="text-sm font-semibold text-on-surface-variant">%</span></span>
              </div>
            </div>
            
            {/* Ring Labels */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-on-surface-variant">Move</span>
                </div>
                <span className="text-sm font-bold">{dailyStats.calories} <span className="text-on-surface-variant font-normal text-xs">kcal</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6FFB85]" />
                  <span className="text-xs font-medium text-on-surface-variant">Exercise</span>
                </div>
                <span className="text-sm font-bold">{dailyStats.duration} <span className="text-on-surface-variant font-normal text-xs">min</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fab0ff]" />
                  <span className="text-xs font-medium text-on-surface-variant">Stand</span>
                </div>
                <span className="text-sm font-bold">10 <span className="text-on-surface-variant font-normal text-xs">hrs</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats — clean row */}
        <section className="grid grid-cols-3 gap-3">
          <Link to="/nutrition" className="bg-[var(--color-surface-container)] rounded-2xl p-4 hover:bg-[var(--color-surface-container-high)] transition-colors text-center">
            <span className="material-symbols-outlined text-primary text-xl mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            <p className="font-headline font-bold text-lg leading-none">{dailyStats.calories}</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-1">Calories</p>
          </Link>
          <Link to="/health" className="bg-[var(--color-surface-container)] rounded-2xl p-4 hover:bg-[var(--color-surface-container-high)] transition-colors text-center">
            <span className="material-symbols-outlined text-[#6FFB85] text-xl mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>steps</span>
            <p className="font-headline font-bold text-lg leading-none">{dailyStats.steps}</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-1">Steps</p>
          </Link>
          <Link to="/health" className="bg-[var(--color-surface-container)] rounded-2xl p-4 hover:bg-[var(--color-surface-container-high)] transition-colors text-center">
            <span className="material-symbols-outlined text-[#60A5FA] text-xl mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
            <p className="font-headline font-bold text-lg leading-none">{dailyStats.water.toFixed(1)}<span className="text-xs font-normal text-on-surface-variant ml-0.5">L</span></p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-1">Water</p>
          </Link>
        </section>

        {/* Next Workout Card — with photo */}
        <Link to="/workout" className="block bg-[var(--color-surface-container)] rounded-2xl overflow-hidden group hover:bg-[var(--color-surface-container-high)] transition-colors">
          <div className="h-36 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=640&auto=format&fit=crop')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-container)] via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="bg-primary text-black text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">Up Next</span>
            </div>
          </div>
          <div className="px-5 pb-5 -mt-4 relative z-10">
            <h3 className="font-headline font-bold text-lg">{profile.goal === 'Fat Loss' ? 'HIIT Burn Cycle' : 'Upper Body — Push'}</h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-on-surface-variant text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">timer</span> 45 min
              </span>
              <span className="text-on-surface-variant text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">fitness_center</span> 6 exercises
              </span>
              <span className="text-primary text-xs font-semibold ml-auto group-hover:underline">Start →</span>
            </div>
          </div>
        </Link>

        {/* Macros — clean bars */}
        <Link to="/nutrition" className="block bg-[var(--color-surface-container)] rounded-2xl p-5 hover:bg-[var(--color-surface-container-high)] transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline font-bold text-base">Nutrition</h2>
            <span className="text-on-surface-variant text-xs font-medium">See all →</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-on-surface-variant font-medium">Protein</span>
                <span className="font-semibold">80g <span className="text-on-surface-variant font-normal">/ 200g</span></span>
              </div>
              <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: '40%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-on-surface-variant font-medium">Carbs</span>
                <span className="font-semibold">120g <span className="text-on-surface-variant font-normal">/ 260g</span></span>
              </div>
              <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden">
                <div className="bg-[#60A5FA] h-full rounded-full transition-all" style={{ width: '46%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-on-surface-variant font-medium">Fat</span>
                <span className="font-semibold">40g <span className="text-on-surface-variant font-normal">/ 80g</span></span>
              </div>
              <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden">
                <div className="bg-[#FBBF24] h-full rounded-full transition-all" style={{ width: '50%' }} />
              </div>
            </div>
          </div>
        </Link>

        {/* Streak & Recovery — side by side */}
        <section className="grid grid-cols-2 gap-3">
          <div onClick={() => navigate('/reports')} className="bg-[var(--color-surface-container)] rounded-2xl p-5 cursor-pointer hover:bg-[var(--color-surface-container-high)] transition-colors">
            <span className="material-symbols-outlined text-[#FF4D4D] text-xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            <p className="font-headline font-black text-3xl tracking-tight">14</p>
            <p className="text-on-surface-variant text-[11px] font-medium mt-0.5">Day streak</p>
          </div>
          <div onClick={() => navigate('/reports')} className="bg-[var(--color-surface-container)] rounded-2xl p-5 cursor-pointer hover:bg-[var(--color-surface-container-high)] transition-colors">
            <span className="material-symbols-outlined text-[#6FFB85] text-xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>battery_charging_full</span>
            <p className="font-headline font-black text-3xl tracking-tight">88</p>
            <p className="text-on-surface-variant text-[11px] font-medium mt-0.5">Recovery score</p>
          </div>
        </section>

        {/* Weight Trend — clean chart */}
        <Link to="/profile" className="block bg-[var(--color-surface-container)] rounded-2xl p-5 hover:bg-[var(--color-surface-container-high)] transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-headline font-bold text-base">Weight</h2>
              <p className="text-[#6FFB85] text-xs font-medium mt-0.5">↓ Trending down</p>
            </div>
            <div className="text-right">
              <span className="font-headline font-bold text-2xl">{profile.weight}</span>
              <span className="text-on-surface-variant text-xs ml-1">lbs</span>
            </div>
          </div>
          <div className="h-24 w-full">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="graphGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#6FFB85" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#6FFB85" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,40 C60,50 120,55 180,70 C240,85 300,60 360,75 C420,90 480,100 540,110 C600,120 660,130 720,140 L800,155 V200 H0 Z" fill="url(#graphGradient)" />
              <path d="M0,40 C60,50 120,55 180,70 C240,85 300,60 360,75 C420,90 480,100 540,110 C600,120 660,130 720,140 L800,155" fill="transparent" stroke="#6FFB85" strokeLinecap="round" strokeWidth="2.5" />
              <circle cx="800" cy="155" fill="#6FFB85" r="4" />
            </svg>
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant font-medium px-1">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </Link>

        {/* Quick Links — simplified 2x2 grid */}
        <section className="grid grid-cols-2 gap-3">
          {[
            { to: '/health', icon: 'monitor_heart', label: 'Health', color: '#FF4D4D' },
            { to: '/community', icon: 'groups', label: 'Community', color: '#fab0ff' },
            { to: '/reports', icon: 'query_stats', label: 'Reports', color: '#6FFB85' },
            { to: '/settings', icon: 'settings', label: 'Settings', color: 'var(--color-on-surface-variant)' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="bg-[var(--color-surface-container)] rounded-2xl p-4 flex items-center gap-3 hover:bg-[var(--color-surface-container-high)] transition-colors">
              <span className="material-symbols-outlined text-xl" style={{ color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <span className="font-headline font-semibold text-sm">{item.label}</span>
            </Link>
          ))}
        </section>

      </main>
    </>
  );
}
