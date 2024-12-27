import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '../../../lib/supabaseClient';

export const SocialLogin: React.FC = () => {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err) {
      console.error('Error signing in with Google:', err);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full"
      >
        Continue with Google
      </Button>
    </div>
  );
}; 
