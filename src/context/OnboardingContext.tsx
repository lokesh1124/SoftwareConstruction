import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OnboardingData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  targetWeight: number;
  goal: string;
  fitnessLevel: string;
  activityLevel: string;
  workoutPreference: string;
  workoutDays: number;
  dietPreference: string;
  sleepQuality: string;
  injuries: string;
  motivationLevel: string;
}

interface OnboardingContextType {
  isOnboarded: boolean;
  onboardingData: OnboardingData;
  completeOnboarding: (data: OnboardingData) => void;
  resetOnboarding: () => void;
}

const DEFAULT_DATA: OnboardingData = {
  name: '',
  age: 25,
  gender: 'Male',
  height: 70,
  weight: 170,
  targetWeight: 165,
  goal: 'Hypertrophy Phase',
  fitnessLevel: 'Intermediate',
  activityLevel: 'Moderate',
  workoutPreference: 'Gym',
  workoutDays: 5,
  dietPreference: 'Standard',
  sleepQuality: 'Good',
  injuries: 'None',
  motivationLevel: 'High',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('myfitai_onboarded') === 'true';
  });
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('myfitai_onboarding_data');
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

  useEffect(() => {
    localStorage.setItem('myfitai_onboarded', String(isOnboarded));
  }, [isOnboarded]);

  useEffect(() => {
    localStorage.setItem('myfitai_onboarding_data', JSON.stringify(onboardingData));
  }, [onboardingData]);

  const completeOnboarding = (data: OnboardingData) => {
    setOnboardingData(data);
    setIsOnboarded(true);
  };

  const resetOnboarding = () => {
    setIsOnboarded(false);
    setOnboardingData(DEFAULT_DATA);
    localStorage.removeItem('myfitai_onboarded');
    localStorage.removeItem('myfitai_onboarding_data');
  };

  return (
    <OnboardingContext.Provider value={{ isOnboarded, onboardingData, completeOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
  return context;
}
