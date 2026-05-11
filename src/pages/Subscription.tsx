import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Subscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const { showToast } = useToast();

  const plans = {
    monthly: { price: '$14.99', period: '/month', save: '' },
    yearly: { price: '$7.99', period: '/month', save: 'Save 47%' },
  };

  const features = [
    { icon: 'auto_awesome', title: 'AI Elite Coaching', desc: 'Unlimited personalized AI workout & nutrition advice', free: false, pro: true },
    { icon: 'analytics', title: 'Advanced Analytics', desc: 'Deep dive into performance trends & predictions', free: false, pro: true },
    { icon: 'watch', title: 'Wearable Integrations', desc: 'Sync with Apple Watch, WHOOP, Garmin, & more', free: false, pro: true },
    { icon: 'edit_note', title: 'Custom Programs', desc: 'Build & save unlimited custom workout programs', free: false, pro: true },
    { icon: 'download', title: 'Export Reports', desc: 'PDF & CSV export of all your fitness data', free: false, pro: true },
    { icon: 'support_agent', title: 'Priority Support', desc: '24/7 priority support from fitness experts', free: false, pro: true },
    { icon: 'fitness_center', title: 'Workout Tracking', desc: 'Log sets, reps, weight with rest timer', free: true, pro: true },
    { icon: 'restaurant', title: 'Basic Nutrition', desc: 'Daily calorie & macro tracking', free: true, pro: true },
    { icon: 'trending_up', title: 'Progress Charts', desc: 'Weight & strength trend graphs', free: true, pro: true },
  ];

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32 space-y-8">
      <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      {/* Hero */}
      <div className="text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#FFD700] to-[#FF8C00] rounded-3xl flex items-center justify-center shadow-[0_16px_50px_rgba(255,215,0,0.3)]">
            <span className="material-symbols-outlined text-black text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
          </div>
          <h1 className="font-headline font-black text-4xl tracking-tighter mb-2 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] bg-clip-text text-transparent">Go Pro</h1>
          <p className="text-on-surface-variant text-sm max-w-xs mx-auto leading-relaxed">Unlock the full power of AI-driven fitness coaching</p>
        </div>
      </div>

      {/* Plan Toggle */}
      <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/5">
        {(['monthly', 'yearly'] as const).map(plan => (
          <button
            key={plan}
            onClick={() => setSelectedPlan(plan)}
            className={`flex-1 py-3.5 rounded-xl font-headline font-bold text-sm uppercase tracking-widest transition-all relative ${
              selectedPlan === plan
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black shadow-[0_4px_20px_rgba(255,215,0,0.3)]'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            {plan}
            {plan === 'yearly' && selectedPlan !== 'yearly' && (
              <span className="absolute -top-2 right-2 text-[8px] bg-secondary text-[#004818] px-2 py-0.5 rounded-full font-black">BEST</span>
            )}
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="text-center py-4">
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-headline font-black text-5xl tracking-tighter">{plans[selectedPlan].price}</span>
          <span className="text-on-surface-variant text-sm font-medium">{plans[selectedPlan].period}</span>
        </div>
        {plans[selectedPlan].save && (
          <span className="inline-block mt-2 text-[10px] font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 uppercase tracking-widest">{plans[selectedPlan].save}</span>
        )}
        {selectedPlan === 'yearly' && <p className="text-on-surface-variant text-xs mt-2">Billed annually at $95.88</p>}
      </div>

      {/* CTA */}
      <button
        onClick={() => showToast('Redirecting to secure checkout...', 'success')}
        className="w-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black font-headline font-black py-5 rounded-2xl text-sm uppercase tracking-widest shadow-[0_12px_40px_rgba(255,215,0,0.3)] active:scale-[0.97] transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">bolt</span>
        Start Free Trial
      </button>
      <p className="text-center text-[10px] text-white/30">7-day free trial • Cancel anytime</p>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant px-2">What's Included</h3>
        {features.map((f, i) => (
          <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${!f.free ? 'bg-[#FFD700]/5 border border-[#FFD700]/10' : 'bg-white/5 border border-white/5'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!f.free ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-white/5 text-on-surface-variant'}`}>
              <span className="material-symbols-outlined text-lg" style={!f.free ? { fontVariationSettings: "'FILL' 1" } : {}}>{f.icon}</span>
            </div>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm">{f.title}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{f.desc}</p>
            </div>
            {!f.free ? (
              <span className="text-[8px] bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded-full font-black uppercase tracking-widest border border-[#FFD700]/20">PRO</span>
            ) : (
              <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
