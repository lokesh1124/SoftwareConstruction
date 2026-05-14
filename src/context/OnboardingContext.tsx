import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { syncToCloud } from '../services/cloudSync';
import { storage } from '../utils/storage';

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
  const { cloudData } = useAuth();
  
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return storage.get<boolean>('myfitai_onboarded') === true;
  });
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    const saved = storage.get<OnboardingData>('myfitai_onboarding_data');
    return saved || DEFAULT_DATA;
  });

  // Sync from cloud on load
  useEffect(() => {
    if (cloudData && cloudData.onboarding) {
      setIsOnboarded(cloudData.onboarding.isOnboarded);
      setOnboardingData(cloudData.onboarding.data);
    }
  }, [cloudData]);

  useEffect(() => {
    storage.set('myfitai_onboarded', isOnboarded);
  }, [isOnboarded]);

  useEffect(() => {
    storage.set('myfitai_onboarding_data', onboardingData);
  }, [onboardingData]);

  const completeOnboarding = (data: OnboardingData) => {
    setOnboardingData(data);
    setIsOnboarded(true);
    syncToCloud('onboarding', { isOnboarded: true, data });
  };

  const resetOnboarding = () => {
    setIsOnboarded(false);
    setOnboardingData(DEFAULT_DATA);
    storage.remove('myfitai_onboarded');
    storage.remove('myfitai_onboarding_data');
    syncToCloud('onboarding', { isOnboarded: false, data: DEFAULT_DATA });
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
