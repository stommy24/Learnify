import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, session, user: session?.user ?? null }));
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({ ...prev, session, user: session?.user ?? null }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // Redirect to verification page
      router.push('/auth/verify-email');
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/auth/login');
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateEmail = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: state.user?.email!,
      });
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateEmail,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
