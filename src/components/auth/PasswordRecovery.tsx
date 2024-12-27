import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';

export const PasswordRecovery: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus('loading');
      await resetPassword(email);
      setStatus('success');
    } catch (err) {
      setError('Failed to send recovery email');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <p className="mt-2 text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {status === 'success' ? (
        <Alert
          type="success"
          message="Check your email for the reset link"
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          {status === 'error' && (
            <Alert type="error" message={error || 'An error occurred'} />
          )}

          <Button
            type="submit"
            loading={status === 'loading'}
            className="w-full"
          >
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
}; 
