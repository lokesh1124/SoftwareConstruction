import { useState } from 'react';
import { useFitnessContext } from '../context/FitnessContext';
import type { FitnessGoal } from '../context/FitnessContext';

const STEPS = ['basics', 'body', 'goals', 'lifestyle', 'complete'] as const;
type Step = typeof STEPS[number];

export default function OnboardingForm({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { profile, updateProfile } = useFitnessContext();
  const [step, setStep] = useState<Step>('basics');
  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    gender: profile.gender || 'Male',
    height: profile.height,
    weight: profile.weight,
    targetWeight: profile.targetWeight,
    goal: profile.goal,
    fitnessLevel: 'Intermediate',
    activityLevel: 'Moderate',
    workoutPreference: 'Gym',
    workoutDays: 5,
    dietPreference: 'Standard',
    sleepQuality: 'Good',
    injuries: 'None',
    motivationLevel: 'High',
  });

  if (!isOpen) return null;

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    updateProfile({
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      targetWeight: formData.targetWeight,
      goal: formData.goal as FitnessGoal,
    });
    setStep('complete');
    setTimeout(() => { onClose(); setStep('basics'); }, 2000);
  };

  const currentIdx = STEPS.indexOf(step);
  const progressPct = step === 'complete' ? 100 : ((currentIdx) / (STEPS.length - 1)) * 100;

  const inputClass = "w-full bg-[var(--color-surface)] outline-none rounded-xl px-4 py-3.5 border border-white/10 focus:border-primary transition-all text-sm font-medium";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2";
  const chipClass = (selected: boolean) => `px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border active:scale-95 ${selected ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(255,122,0,0.3)]' : 'bg-[var(--color-surface)] text-on-surface-variant border-white/10 hover:border-white/30'}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-[var(--color-surface-container)] w-full max-w-lg rounded-[2rem] shadow-2xl relative border border-white/10 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-[#252528] w-full">
          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              {step !== 'complete' && <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">Step {currentIdx + 1} of {STEPS.length - 1}</p>}
              <h2 className="font-headline text-2xl font-bold tracking-tight">
                {step === 'basics' && 'Who Are You?'}
                {step === 'body' && 'Body Metrics'}
                {step === 'goals' && 'Your Goals'}
                {step === 'lifestyle' && 'Lifestyle & Preferences'}
                {step === 'complete' && 'You\'re All Set! 🎉'}
              </h2>
            </div>
            <button onClick={() => { onClose(); setStep('basics'); }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Step 1: Basics */}
          {step === 'basics' && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input value={formData.name} onChange={e => handleChange('name', e.target.value)} className={inputClass} placeholder="Enter your name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Age</label>
                  <input type="number" value={formData.age} onChange={e => handleChange('age', Number(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <div className="flex gap-2">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button key={g} onClick={() => handleChange('gender', g)} className={chipClass(formData.gender === g)}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Fitness Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                    <button key={l} onClick={() => handleChange('fitnessLevel', l)} className={chipClass(formData.fitnessLevel === l)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Body */}
          {step === 'body' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Height (inches)</label>
                  <input type="number" value={formData.height} onChange={e => handleChange('height', Number(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Current Weight (lbs)</label>
                  <input type="number" step="0.1" value={formData.weight} onChange={e => handleChange('weight', Number(e.target.value))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Target Weight (lbs)</label>
                <input type="number" step="0.1" value={formData.targetWeight} onChange={e => handleChange('targetWeight', Number(e.target.value))} className={inputClass} />
              </div>
              <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Current BMI</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{formData.weight > formData.targetWeight ? 'Fat loss phase' : 'Lean bulk phase'}</p>
                </div>
                <span className="font-headline font-black text-3xl text-primary">
                  {formData.height > 0 ? ((703 * formData.weight) / (formData.height * formData.height)).toFixed(1) : '—'}
                </span>
              </div>
              <div>
                <label className={labelClass}>Any Injuries?</label>
                <div className="flex flex-wrap gap-2">
                  {['None', 'Lower Back', 'Knee', 'Shoulder', 'Wrist', 'Neck', 'Ankle'].map(inj => (
                    <button key={inj} onClick={() => handleChange('injuries', inj)} className={chipClass(formData.injuries === inj)}>{inj}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 'goals' && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Primary Goal</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'Fat Loss', icon: 'local_fire_department', color: '#FF4D4D' },
                    { val: 'Hypertrophy Phase', icon: 'fitness_center', color: '#FF7A00' },
                    { val: 'Endurance', icon: 'directions_run', color: '#6FFB85' },
                    { val: 'Maintenance', icon: 'balance', color: '#fab0ff' },
                  ].map(g => (
                    <button key={g.val} onClick={() => handleChange('goal', g.val)} className={`p-4 rounded-2xl border transition-all text-left active:scale-95 ${formData.goal === g.val ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(255,122,0,0.15)]' : 'bg-[var(--color-surface)] border-white/10 hover:border-white/30'}`}>
                      <span className="material-symbols-outlined text-2xl mb-2 block" style={{ color: g.color, fontVariationSettings: "'FILL' 1" }}>{g.icon}</span>
                      <p className="font-headline font-bold text-sm">{g.val}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Available Workout Days: <span className="text-primary">{formData.workoutDays}</span></label>
                <input type="range" min="2" max="7" value={formData.workoutDays} onChange={e => handleChange('workoutDays', Number(e.target.value))} className="w-full accent-primary h-2 bg-[#252528] rounded-full appearance-none cursor-pointer" />
                <div className="flex justify-between text-[9px] text-on-surface-variant font-bold mt-1"><span>2 days</span><span>7 days</span></div>
              </div>
              <div>
                <label className={labelClass}>Motivation Level</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High', 'Beast Mode'].map(m => (
                    <button key={m} onClick={() => handleChange('motivationLevel', m)} className={`flex-1 ${chipClass(formData.motivationLevel === m)}`}>{m}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Lifestyle */}
          {step === 'lifestyle' && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Activity Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sedentary', 'Light', 'Moderate', 'Very Active'].map(a => (
                    <button key={a} onClick={() => handleChange('activityLevel', a)} className={chipClass(formData.activityLevel === a)}>{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Workout Environment</label>
                <div className="flex gap-2">
                  {['Gym', 'Home', 'Both', 'Outdoor'].map(w => (
                    <button key={w} onClick={() => handleChange('workoutPreference', w)} className={`flex-1 ${chipClass(formData.workoutPreference === w)}`}>{w}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Diet Preference</label>
                <div className="flex flex-wrap gap-2">
                  {['Standard', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Indian', 'Mediterranean'].map(d => (
                    <button key={d} onClick={() => handleChange('dietPreference', d)} className={chipClass(formData.dietPreference === d)}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Sleep Quality</label>
                <div className="flex gap-2">
                  {['Poor', 'Fair', 'Good', 'Excellent'].map(s => (
                    <button key={s} onClick={() => handleChange('sleepQuality', s)} className={`flex-1 ${chipClass(formData.sleepQuality === s)}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto border border-secondary/40 shadow-[0_0_40px_rgba(111,251,133,0.3)]">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <p className="text-on-surface-variant text-sm">Your personalized AI fitness plan is being generated...</p>
              <div className="w-32 h-1 bg-[#252528] rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-secondary rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step !== 'complete' && (
            <div className="flex gap-3 mt-8">
              {currentIdx > 0 && (
                <button onClick={() => setStep(STEPS[currentIdx - 1])} className="px-6 py-3.5 rounded-xl border border-white/10 text-on-surface-variant font-headline font-bold text-sm hover:bg-white/5 transition-all">
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (currentIdx < STEPS.length - 2) setStep(STEPS[currentIdx + 1]);
                  else handleSubmit();
                }}
                className="flex-1 bg-primary text-black font-headline font-bold text-sm py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,122,0,0.3)]"
              >
                {currentIdx < STEPS.length - 2 ? 'Continue' : 'Generate My Plan'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
