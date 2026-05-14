import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDZ5ap3oLgWAVe9CU0tct7yxDL_HAiag6Y",
  authDomain: "myfitai-2bb4f.firebaseapp.com",
  projectId: "myfitai-2bb4f",
  storageBucket: "myfitai-2bb4f.firebasestorage.app",
  messagingSenderId: "31980924443",
  appId: "1:31980924443:web:f8d76afd09f1594b21d2be",
  measurementId: "G-E7JL5B8GK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
