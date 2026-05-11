import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const FAQ_DATA = [
  { q: 'How does the AI workout generator work?', a: 'Our AI analyzes your fitness level, goals, available equipment, recovery status, and training history to generate scientifically optimized workout programs. It adapts as you progress.' },
  { q: 'Can I use MyFitAI without equipment?', a: 'Absolutely! During onboarding, select "Bodyweight" as your equipment preference. The AI will generate effective calisthenics and bodyweight routines.' },
  { q: 'How accurate is the calorie tracking?', a: 'Our nutrition database contains 500,000+ foods with verified nutritional data. Calorie estimates are within 5-10% accuracy for logged meals.' },
  { q: 'Does MyFitAI work with wearables?', a: 'Pro subscribers can sync with Apple Watch, WHOOP, Garmin, Fitbit, and Samsung Galaxy Watch for automatic heart rate, sleep, and activity data.' },
  { q: 'How do I track my progress?', a: 'Navigate to the Progress tab to view weight trends, strength charts, consistency heatmaps, body measurements, and AI-generated monthly reports.' },
  { q: 'Can I customize my meal plan?', a: 'Yes! The Nutrition tab supports multiple diet preferences including Standard, Vegetarian, Vegan, Keto, Indian, Mediterranean, and Paleo options.' },
  { q: 'What is the readiness score?', a: 'The readiness score (0-100) combines your sleep quality, recovery status, stress levels, and training load to suggest optimal workout intensity for the day.' },
  { q: 'How do streaks work?', a: 'Complete at least one logged activity (workout, meal log, or health metric) each day to maintain your streak. Streaks earn bonus XP and unlock achievements.' },
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const filtered = searchQuery
    ? FAQ_DATA.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : FAQ_DATA;

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32 space-y-8">
      <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <header>
        <p className="text-primary font-label font-bold tracking-widest uppercase text-[10px] mb-2">Support</p>
        <h1 className="font-headline font-extrabold text-4xl tracking-tighter">Help Center</h1>
      </header>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        <input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[var(--color-surface-container)] rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/30 outline-none border border-white/5 focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: 'fitness_center', label: 'Workout Guide', color: '#FF7A00' },
          { icon: 'restaurant', label: 'Nutrition Help', color: '#6FFB85' },
          { icon: 'analytics', label: 'Progress Tips', color: '#fab0ff' },
          { icon: 'settings', label: 'Account Help', color: '#ff9800' },
        ].map((link, i) => (
          <button key={i} onClick={() => showToast(`${link.label} feature coming soon!`, 'info')} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--color-surface-container)] border border-white/5 hover:border-white/20 transition-colors active:scale-95 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{link.icon}</span>
            </div>
            <span className="font-headline font-bold text-sm text-white/80 group-hover:text-white transition-colors">{link.label}</span>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant px-2">Frequently Asked Questions</h3>
        {filtered.map((faq, i) => (
          <div key={i} className="bg-[var(--color-surface-container)] rounded-2xl border border-white/5 overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-headline font-bold text-sm pr-4">{faq.q}</span>
              <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform flex-shrink-0 ${openIdx === i ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5 pt-0 border-t border-white/5">
                <p className="text-sm text-on-surface-variant leading-relaxed pt-4">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-white/10 mb-3 block">search_off</span>
            <p className="text-on-surface-variant text-sm">No results found</p>
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-[2rem] p-6 border border-primary/20 text-center">
        <span className="material-symbols-outlined text-primary text-3xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
        <h3 className="font-headline font-bold text-lg mb-2">Still need help?</h3>
        <p className="text-on-surface-variant text-sm mb-4">Our support team typically responds within 2 hours</p>
        <button onClick={() => showToast('Live chat is currently offline. Please check back later.', 'info')} className="px-6 py-3 bg-primary text-black rounded-xl font-headline font-bold text-sm uppercase tracking-widest active:scale-95 transition-all">
          Contact Support
        </button>
      </div>
    </main>
  );
}
