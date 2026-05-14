import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { syncToCloud } from '../services/cloudSync';
import { storage } from '../utils/storage';

// Define types
export type FitnessGoal = 'Hypertrophy Phase' | 'Fat Loss' | 'Endurance' | 'Maintenance';

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number; // in inches
  weight: number; // in lbs
  bmi: number;
  goal: FitnessGoal;
  targetWeight: number;
  dailyStepGoal: number;
  dailyCalorieGoal: number;
  dailyWaterGoal: number; // in Liters
}

export interface Activity {
  id: string;
  type: string; // 'Workout', 'Steps', 'Water', 'Sleep'
  value: number; // Duration in mins, step count, liters, hours
  caloriesBurned?: number;
  timestamp: string;
}

interface FitnessContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  activities: Activity[];
  logActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  dailyStats: {
    calories: number;
    steps: number;
    water: number;
    sleep: number;
    duration: number;
  };
}

// Default initial state
const defaultProfile: UserProfile = {
  name: 'Athlete',
  age: 28,
  gender: 'Male',
  height: 72, 
  weight: 178.5,
  bmi: 24.2,
  goal: 'Hypertrophy Phase',
  targetWeight: 185,
  dailyStepGoal: 10000,
  dailyCalorieGoal: 2800,
  dailyWaterGoal: 3.0,
};

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export function FitnessProvider({ children }: { children: React.ReactNode }) {
  const { cloudData } = useAuth();

  // Try to load from storage
  const loadInitialProfile = () => {
    const saved = storage.get<UserProfile>('kinetic_profile');
    return saved || defaultProfile;
  };

  const loadInitialActivities = () => {
    const saved = storage.get<Activity[]>('kinetic_activities');
    return saved || [];
  };

  const [profile, setProfile] = useState<UserProfile>(loadInitialProfile);
  const [activities, setActivities] = useState<Activity[]>(loadInitialActivities);

  // Sync from cloud on load
  useEffect(() => {
    if (cloudData && cloudData.fitness) {
      if (cloudData.fitness.profile) setProfile(cloudData.fitness.profile);
      if (cloudData.fitness.activities) setActivities(cloudData.fitness.activities);
    }
  }, [cloudData]);

  // Sync with storage and cloud
  useEffect(() => {
    storage.set('kinetic_profile', profile);
    // Optional: avoid syncing initial default state if not modified, but for now we sync
    syncToCloud('fitness', { profile, activities });
  }, [profile]);

  useEffect(() => {
    storage.set('kinetic_activities', activities);
    syncToCloud('fitness', { profile, activities });
  }, [activities]);

  // Calculate daily stats based on today's activities
  const getTodayStats = () => {
    const today = new Date().toDateString();
    let calories = 0, steps = 0, water = 0, sleep = 0, duration = 0;

    activities.forEach(act => {
      const actDate = new Date(act.timestamp).toDateString();
      if (actDate === today) {
        if (act.type === 'Workout') {
          calories += act.caloriesBurned || 0;
          duration += act.value; // duration in mins
        }
        if (act.type === 'Steps') steps += act.value;
        if (act.type === 'Water') water += act.value;
        if (act.type === 'Sleep') sleep += act.value;
      }
    });

    return { calories, steps, water, sleep, duration };
  };

  const calculateBMI = (weightLbs: number, heightInches: number) => {
    // Formula: (703 x weight in lbs) / (height in inches)^2
    if (!heightInches || !weightLbs) return 0;
    return Number(((703 * weightLbs) / (heightInches * heightInches)).toFixed(1));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      // Recalculate BMI if changing weight or height
      if (updates.weight || updates.height) {
        next.bmi = calculateBMI(next.weight, next.height);
      }
      return next;
    });
  };

  const logActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  return (
    <FitnessContext.Provider value={{
      profile,
      updateProfile,
      activities,
      logActivity,
      dailyStats: getTodayStats(),
    }}>
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitnessContext() {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitnessContext must be used within a FitnessProvider');
  }
  return context;
}
