import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';
import { storage } from '../utils/storage';

export interface CloudData {
  onboarding?: any;
  fitness?: any;
  gamification?: any;
  preferences?: any;
}

/**
 * Fetches the user's entire cloud profile.
 */
export async function getCloudProfile(): Promise<CloudData | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as CloudData;
    }
  } catch (err) {
    console.error('Failed to get cloud profile:', err);
  }
  return null;
}

/**
 * Syncs a specific section (e.g. 'onboarding', 'fitness') to the user's document.
 */
export async function syncToCloud(section: keyof CloudData, data: any) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    // Use setDoc with merge: true to avoid overwriting other sections
    await setDoc(userDocRef, { [section]: data }, { merge: true });
  } catch (err) {
    console.error(`Failed to sync ${section} to cloud:`, err);
  }
}

/**
 * Helper to clear local state completely on logout for the current user namespace.
 */
export function clearAllLocalState() {
  const keys = storage.keys();
  for (const key of keys) {
    storage.remove(key);
  }
}
