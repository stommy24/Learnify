import React, { useState } from 'react';
import { useRBAC } from '@/lib/rbac/RBACProvider';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';

export const AgeVerification: React.FC = () => {
  const { verifyAge, loading, error } = useRBAC();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [guardianConsent, setGuardianConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateOfBirth) {
      await verifyAge(new Date(dateOfBirth));
    }
  };

  const calculateAge = (dob: string) => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age;
  };

  const requiresGuardianConsent = dateOfBirth && calculateAge(dateOfBirth) < 16;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Age Verification</h2>
        <p className="mt-2 text-gray-600">
          Please provide your date of birth to ensure age-appropriate content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        {requiresGuardianConsent && (
          <div className="space-y-2">
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={guardianConsent}
                onChange={(e) => setGuardianConsent(e.target.checked)}
                className="mt-1"
                required
              />
              <label className="ml-2 text-sm text-gray-600">
                I confirm that I have guardian consent to use this platform
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Users under 16 require guardian consent
            </p>
          </div>
        )}

        {error && <Alert type="error" message={error.message} />}

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          Verify Age
        </Button>
      </form>
    </div>
  );
}; 
