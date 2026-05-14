import { useState } from 'react';
import { useFitnessContext } from '../context/FitnessContext';
import OnboardingForm from '../components/OnboardingForm';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';

export default function ProfileSettings() {
  const { profile } = useFitnessContext();
  const { weightUnit, heightUnit } = usePreferences();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { showToast } = useToast();
  const { logout } = useAuth();

  const activeStreak = profile.goal === 'Fat Loss' ? 12 : 42; 

  const displayWeight = weightUnit === 'kg' ? Math.round(profile.weight / 2.20462 * 10) / 10 : profile.weight;
  const displayTargetWeight = weightUnit === 'kg' ? Math.round(profile.targetWeight / 2.20462 * 10) / 10 : profile.targetWeight;
  const displayHeight = heightUnit === 'cm' ? Math.round(profile.height * 2.54) : profile.height;

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-32">
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center gap-4 mb-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[var(--color-surface-container)] overflow-hidden ring-2 ring-white/[0.06]">
            <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxJE5KF2fqN7gb85FTht8B-fqltWz2KqH8IAg3Q52cdKy-9oEBq1JqZtputtX2b0LKFr0ERhhobHyYtMyw36FdrPA26RnaGz24q6s9m7tUAYI34zXso5cd3YPiUPcACBaFgQagLrYrI2_ORPWsBCumqsVJdYOg2-ExWuv5_cUr__PBcWdwR2gaGrjx_v1vsex37A5vUxRVisCVjVshT2G5D6Op5FO0buveRPzMrEN8U8QeiPhaTtBmMq4kD-9Dq-y4R7MR_-3YzuPj"/>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-[#6FFB85] rounded-full flex items-center justify-center border-[3px] border-[var(--color-background)]">
            <span className="material-symbols-outlined text-black text-xs" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
          </div>
        </div>
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{profile.goal} · {displayWeight} {weightUnit} · BMI {profile.bmi}</p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-[var(--color-surface-container)] rounded-2xl p-4">
          <p className="text-on-surface-variant text-xs font-medium mb-1">Current Goal</p>
          <p className="font-headline font-bold text-base">{profile.goal}</p>
        </div>
        <div className="bg-[var(--color-surface-container)] rounded-2xl p-4">
          <p className="text-on-surface-variant text-xs font-medium mb-1">Target Weight</p>
          <p className="font-headline font-bold text-base">{displayTargetWeight} {weightUnit}</p>
        </div>
      </section>

      {/* Personal Records */}
      <section className="mb-8">
        <h2 className="font-headline font-bold text-lg mb-4">Personal Records</h2>
        <div className="space-y-3">
          {/* Streak */}
          <div className="bg-[var(--color-surface-container)] rounded-2xl p-5 flex items-center gap-4">
            <span className="material-symbols-outlined text-[#FF4D4D] text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm">Active Streak</p>
              <p className="text-on-surface-variant text-xs mt-0.5">{activeStreak} consecutive days</p>
            </div>
            <span className="font-headline font-black text-2xl">{activeStreak}</span>
          </div>

          {/* PRs row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-4">
              <p className="text-on-surface-variant text-xs font-medium mb-1">Deadlift PR</p>
              <p className="font-headline font-bold text-xl">{weightUnit === 'kg' ? Math.round(315 / 2.20462) : 315} <span className="text-xs text-on-surface-variant font-normal">{weightUnit}</span></p>
            </div>
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-4">
              <p className="text-on-surface-variant text-xs font-medium mb-1">5K Time</p>
              <p className="font-headline font-bold text-xl">21:04 <span className="text-xs text-on-surface-variant font-normal">min</span></p>
            </div>
          </div>

          {/* Sleep Score */}
          <div className="bg-[var(--color-surface-container)] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-xs font-medium mb-1">Avg Sleep Score</p>
              <p className="font-headline font-bold text-xl">92<span className="text-sm text-on-surface-variant font-normal">/100</span></p>
            </div>
            <div className="h-8 flex items-end gap-1">
              {[40, 60, 50, 70, 85].map((h, i) => (
                <div key={i} className="w-1.5 bg-primary rounded-sm transition-all" style={{ height: `${h}%`, opacity: 0.3 + (i * 0.15) }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Settings */}
      <section>
        <h2 className="font-headline font-bold text-lg mb-4">Settings</h2>
        <div className="space-y-2">
          <div onClick={() => setShowOnboarding(true)} className="bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">person_edit</span>
              <div>
                <p className="font-semibold text-sm">Edit Profile</p>
                <p className="text-on-surface-variant text-xs mt-0.5">Height: {displayHeight}{heightUnit} · Target: {displayTargetWeight}{weightUnit}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-base">chevron_right</span>
          </div>

          <div className="bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">shield_person</span>
              <div>
                <p className="font-semibold text-sm">Privacy</p>
                <p className="text-on-surface-variant text-xs mt-0.5">Visibility and data settings</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-base">chevron_right</span>
          </div>
        </div>
        
        <div className="mt-10 text-center space-y-4">
          <button 
            onClick={async () => { 
              await logout();
              showToast('Signed out successfully!', 'success');
            }} 
            className="text-[#FF4D4D] text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            Sign Out
          </button>
          <p className="text-on-surface-variant/40 text-[10px]">MyFitAI v2.1.0</p>
        </div>
      </section>

      <OnboardingForm isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </main>
  );
}
