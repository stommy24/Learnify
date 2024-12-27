import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SignUpFormProps {
  onSignUp?: (credentials: { email: string; password: string }) => Promise<void>;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp }) => {
  const { loading } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onSignUp) {
        await onSignUp({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>
        Sign Up
      </Button>
    </form>
  );
}; 
