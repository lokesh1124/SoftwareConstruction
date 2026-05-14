import { useFitnessContext } from '../context/FitnessContext';
import { useTheme } from '../context/ThemeContext';
import { useOnboarding } from '../context/OnboardingContext';
import { useGamification } from '../context/GamificationContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface SettingsItem {
  icon: string;
  label: string;
  desc: string;
  route: string;
  color: string;
  toggle?: boolean;
  premium?: boolean;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

export default function Settings() {
  const { profile } = useFitnessContext();
  const { theme, toggleTheme } = useTheme();
  const { resetOnboarding } = useOnboarding();
  const { level, levelTitle, xp } = useGamification();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();

  const settingsGroups: SettingsGroup[] = [
    {
      title: 'Account',
      items: [
        { icon: 'person', label: 'Identity Metrics', desc: `${profile.name} • ${profile.weight} lbs`, route: '/profile', color: '#FF7A00' },
        { icon: 'target', label: 'Goals & Targets', desc: profile.goal, route: '/profile', color: '#6FFB85' },
        { icon: 'notifications_active', label: 'Notification Preferences', desc: 'Workout, water, meals', route: '', color: '#fab0ff' },
      ]
    },
    {
      title: 'App',
      items: [
        { icon: 'palette', label: 'Appearance', desc: theme === 'dark' ? 'Dark Mode' : 'Light Mode', route: '', color: '#ff9800', toggle: true },
        { icon: 'language', label: 'Units', desc: 'Imperial (lbs, in)', route: '', color: '#00b4d8' },
        { icon: 'download', label: 'Data Export', desc: 'Export as CSV or PDF', route: '', color: '#FF7A00' },
      ]
    },
    {
      title: 'Explore',
      items: [
        { icon: 'monitor_heart', label: 'Health Hub', desc: 'Recovery, sleep, vitals', route: '/health', color: '#FF4D4D' },
        { icon: 'groups', label: 'Community', desc: 'Feed, challenges, friends', route: '/community', color: '#fab0ff' },
        { icon: 'query_stats', label: 'Reports & Analytics', desc: 'Detailed performance data', route: '/reports', color: '#6FFB85' },
      ]
    },
    {
      title: 'Integrations',
      items: [
        { icon: 'watch', label: 'Wearable Devices', desc: 'Apple Watch, WHOOP, Fitbit', route: '', color: '#FF4D4D' },
        { icon: 'health_and_safety', label: 'Apple Health', desc: 'Sync steps, heart rate', route: '', color: '#6FFB85' },
        { icon: 'cloud_sync', label: 'Cloud Backup', desc: 'Auto-backup to cloud', route: '', color: '#FF7A00' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'Help Center', desc: 'FAQs and guides', route: '/help', color: '#fab0ff' },
        { icon: 'feedback', label: 'Send Feedback', desc: 'Help us improve', route: '/feedback', color: '#00b4d8' },
        { icon: 'shield', label: 'Privacy & Security', desc: 'Data protection settings', route: '/privacy', color: '#FF4D4D' },
        { icon: 'description', label: 'Terms of Service', desc: 'Legal information', route: '', color: '#ff9800' },
      ]
    },
    {
      title: 'Premium',
      items: [
        { icon: 'diamond', label: 'Upgrade to Pro', desc: 'AI coaching, analytics, exports', route: '/subscription', color: '#FFD700', premium: true },
      ]
    },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 pt-8 pb-32 space-y-6">
      <header>
        <p className="text-secondary font-label font-bold tracking-widest uppercase text-[10px] mb-2">Configuration</p>
        <h1 className="font-headline font-extrabold text-4xl tracking-tighter">SETTINGS</h1>
      </header>

      {/* Profile Card */}
      <div onClick={() => navigate('/profile')} className="bg-gradient-to-r from-primary/10 to-transparent rounded-[2rem] p-6 border border-primary/20 flex items-center gap-5 cursor-pointer hover:border-primary/40 transition-colors group active:scale-[0.98]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#CC5F00] flex items-center justify-center shadow-[0_8px_25px_rgba(255,122,0,0.3)] group-hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
        </div>
        <div className="flex-1">
          <h3 className="font-headline font-bold text-lg">{profile.name}</h3>
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">Level {level} • {levelTitle} • {xp} XP</p>
        </div>
        <span className="material-symbols-outlined text-white/30 group-hover:text-primary transition-colors">chevron_right</span>
      </div>

      {settingsGroups.map((group, gi) => (
        <section key={gi}>
          <h2 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-3 px-2">{group.title}</h2>
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] overflow-hidden border border-white/5 divide-y divide-white/5">
            {group.items.map((item, ii) => (
              <div
                key={ii}
                onClick={() => {
                  if (item.toggle) { toggleTheme(); return; }
                  if (item.route) navigate(item.route);
                  else showToast(`${item.label} feature coming soon!`, 'info');
                }}
                className="px-6 py-5 flex items-center justify-between cursor-pointer group hover:bg-white/5 transition-colors active:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: item.premium ? "'FILL' 1" : undefined }}>{item.icon}</span>
                  </div>
                  <div>
                    <h4 className={`font-headline font-bold text-sm ${item.premium ? 'text-[#FFD700]' : ''}`}>{item.label}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.premium && (
                    <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-[#FFD700]/20">PRO</span>
                  )}
                  {item.toggle ? (
                    <div className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-white/20'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant text-sm group-hover:text-primary transition-colors">chevron_right</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="text-center space-y-4 pt-4">
        <button onClick={() => { if (confirm('Reset onboarding? You will re-do the setup flow.')) resetOnboarding(); }} className="text-on-surface-variant font-label font-bold uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto bg-white/5 py-3 px-6 rounded-full border border-white/5 hover:border-white/20">
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Redo Onboarding
        </button>
        <button 
          onClick={async () => {
            await logout();
            showToast('Signed out successfully!', 'success');
          }} 
          className="text-[#FF4D4D] font-label font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-70 transition-opacity flex items-center justify-center gap-2 mx-auto bg-[#FF4D4D]/10 py-3 px-6 rounded-full border border-[#FF4D4D]/20"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
        <p className="text-[9px] text-white/15 font-bold tracking-widest uppercase">MyFitAI v2.1.0 • Build 2026.04</p>
      </div>
    </main>
  );
}
