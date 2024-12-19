import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData extends SignInData {
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithCredentials = async (data: SignInData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signIn('credentials', {
        redirect: false,
        ...data,
      });

      if (result?.error) {
        setError(result.error);
      }

      return !result?.error;
    } catch (err) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      await signIn('google', { redirect: false });
      return true;
    } catch (err) {
      setError('Failed to sign in with Google');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithCredentials = async (data: SignUpData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add user to database
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Sign in after successful signup
      return signInWithCredentials({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      return true;
    } catch (err) {
      setError('Failed to sign out');
      return false;
    }
  };

  return {
    session,
    loading,
    error,
    isAuthenticated: !!session,
    signInWithCredentials,
    signInWithGoogle,
    signUpWithCredentials,
    logout,
  };
} 