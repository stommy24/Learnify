import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';

export const EmailVerification: React.FC = () => {
  const { user, sendVerificationEmail } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    try {
      setStatus('loading');
      await sendVerificationEmail();
      setStatus('success');
      setCountdown(60); // Start 60-second countdown
    } catch (err) {
      setError('Failed to send verification email');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="mt-2 text-gray-600">
          We've sent a verification email to {user?.email}
        </p>
      </div>

      {status === 'success' && (
        <Alert
          type="success"
          message="Verification email sent successfully"
        />
      )}

      {status === 'error' && (
        <Alert type="error" message={error || 'An error occurred'} />
      )}

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Didn't receive the email? Check your spam folder or request a new one.
        </p>

        <Button
          onClick={handleResend}
          loading={status === 'loading'}
          disabled={countdown > 0}
        >
          {countdown > 0
            ? `Resend in ${countdown}s`
            : 'Resend Verification Email'
          }
        </Button>
      </div>
    </div>
  );
}; 
