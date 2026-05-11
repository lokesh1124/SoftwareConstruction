// ─────────────────────────────────────────────────────────────
// MyFitAI — User Preferences Context
// Persisted to localStorage. Controls units, timers, and UX prefs.
// ─────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export interface Preferences {
  weightUnit: 'kg' | 'lbs';
  timeFormat: '12h' | '24h';
  defaultRestTimer: number; // seconds
  defaultWorkoutDays: number;
  voicePromptsEnabled: boolean;
  autoStartRestTimer: boolean;
}

interface PreferencesContextType extends Preferences {
  updatePreferences: (updates: Partial<Preferences>) => void;
}

const DEFAULT_PREFERENCES: Preferences = {
  weightUnit: 'lbs',
  timeFormat: '12h',
  defaultRestTimer: 90,
  defaultWorkoutDays: 4,
  voicePromptsEnabled: false,
  autoStartRestTimer: true,
};

const STORAGE_KEY = 'preferences';

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(() => {
    const saved = storage.get<Preferences>(STORAGE_KEY);
    return saved ? { ...DEFAULT_PREFERENCES, ...saved } : DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, prefs);
  }, [prefs]);

  const updatePreferences = (updates: Partial<Preferences>) => {
    setPrefs(prev => ({ ...prev, ...updates }));
  };

  return (
    <PreferencesContext.Provider value={{ ...prefs, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}
