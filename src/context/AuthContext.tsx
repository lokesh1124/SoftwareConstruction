import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User, 
  onAuthStateChanged, 
  signOut
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { getCloudProfile, clearAllLocalState, type CloudData } from '../services/cloudSync';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  cloudData: CloudData | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloudData, setCloudData] = useState<CloudData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch cloud profile
        const data = await getCloudProfile();
        setCloudData(data);
      } else {
        setCloudData(null);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      clearAllLocalState();
      await signOut(auth);
      window.location.reload(); // Guarantee memory is flushed
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    cloudData,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
