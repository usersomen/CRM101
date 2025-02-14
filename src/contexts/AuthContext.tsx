import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          await syncUserWithSupabase(user);
        } catch (error) {
          console.error('Auth state sync error:', error);
        }
      } else {
        setUser(null);
        // Sign out from Supabase when Firebase user is null
        await supabase.auth.signOut();
      }
      setLoading(false);
    });

    // Check for redirect result on mount
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        try {
          await syncUserWithSupabase(result.user);
        } catch (error) {
          console.error('Redirect sync error:', error);
        }
      }
    }).catch((error) => {
      console.error('Redirect result error:', error);
    });

    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      // Try popup first
      const result = await signInWithPopup(auth, provider);
      await syncUserWithSupabase(result.user);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        // Fall back to redirect
        await signInWithRedirect(auth, provider);
      } else {
        throw error;
      }
    }
  }

  async function signUpWithEmail(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await syncUserWithSupabase(result.user);
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  }

  async function signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncUserWithSupabase(result.user);
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await Promise.all([
        signOut(auth),
        supabase.auth.signOut()
      ]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async function syncUserWithSupabase(user: User) {
    try {
      // Get the Firebase ID token
      const idToken = await user.getIdToken();
      
      // Sign in to Supabase with custom token
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || `${user.uid}@example.com`,
        password: idToken // Use the Firebase ID token as the password
      });

      if (signInError) {
        // If sign in fails, try to sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email: user.email || `${user.uid}@example.com`,
          password: idToken,
        });

        if (signUpError) {
          console.error('Supabase auth error:', signUpError);
          return;
        }
      }

      // Update user data in Supabase
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.uid,
          email: user.email,
          display_name: user.displayName,
          photo_url: user.photoURL,
          provider: user.providerData[0]?.providerId,
          last_sign_in: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error('Database sync error:', upsertError);
        throw upsertError;
      }
    } catch (error) {
      console.error('Error syncing user with Supabase:', error);
      throw error;
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}