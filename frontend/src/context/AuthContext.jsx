import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

let auth = null;
let firebaseInitialized = false;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key' && firebaseConfig.authDomain) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    firebaseInitialized = true;
    console.log("Firebase Auth initialized successfully.");
  } catch (error) {
    console.warn("Failed to initialize Firebase Auth:", error);
  }
} else {
  console.log("Firebase config not found or invalid. Defaulting to Demo Mode.");
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!firebaseInitialized);

  useEffect(() => {
    if (firebaseInitialized && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const userData = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email.split('@')[0],
          };
          setUser(userData);
          sessionStorage.setItem('wasteguide_user', JSON.stringify(userData));
          setIsDemoMode(false);
        } else {
          const demoUser = sessionStorage.getItem('wasteguide_user');
          if (demoUser) {
            const parsed = JSON.parse(demoUser);
            if (parsed && parsed.isDemo) {
              setUser(parsed);
              setIsDemoMode(true);
            } else {
              setUser(null);
              sessionStorage.removeItem('wasteguide_user');
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      const demoUser = sessionStorage.getItem('wasteguide_user');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
      }
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email, password) => {
    if (firebaseInitialized && auth) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential.user;
    } else {
      throw new Error("Firebase Auth is not configured. Please use Demo Mode.");
    }
  };

  const registerWithEmail = async (email, password) => {
    if (firebaseInitialized && auth) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      return credential.user;
    } else {
      throw new Error("Firebase Auth is not configured. Please use Demo Mode.");
    }
  };

  const launchDemoMode = () => {
    const demoUser = {
      uid: 'demo-user-123',
      email: 'demo@wasteguide.ai',
      displayName: 'Demo Resident',
      isDemo: true
    };
    setUser(demoUser);
    sessionStorage.setItem('wasteguide_user', JSON.stringify(demoUser));
    setIsDemoMode(true);
    return demoUser;
  };

  const logout = async () => {
    if (firebaseInitialized && auth) {
      await fbSignOut(auth);
    }
    setUser(null);
    sessionStorage.removeItem('wasteguide_user');
  };

  const value = {
    user,
    loading,
    isDemoMode,
    firebaseConfigured: firebaseInitialized,
    loginWithEmail,
    registerWithEmail,
    launchDemoMode,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
