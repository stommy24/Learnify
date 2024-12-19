import React, { useState } from 'react';
import { useRBAC } from '@/lib/rbac/RBACProvider';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';

export const GuardianVerification: React.FC = () => {
  const { updateVerificationStatus, loading, error } = useRBAC();
  const [verificationMethod, setVerificationMethod] = useState<'ID' | 'Address'>('ID');
  const [documents, setDocuments] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('uploading');
    try {
      await updateVerificationStatus(documents);
      setStatus('success');
    } catch (err) {
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Guardian Verification</h2>
        <p className="mt-2 text-gray-600">
          Please provide documentation to verify your guardian status
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Verification Method
          </label>
          <select
            value={verificationMethod}
            onChange={(e) => setVerificationMethod(e.target.value as 'ID' | 'Address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="ID">Government ID</option>
            <option value="Address">Proof of Address</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Documents
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
          <p className="mt-1 text-sm text-gray-500">
            {verificationMethod === 'ID'
              ? 'Please provide a valid government-issued ID'
              : 'Please provide a recent utility bill or bank statement'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-start">
            <input
              type="checkbox"
              required
              className="mt-1"
            />
            <label className="ml-2 text-sm text-gray-600">
              I confirm that I am legally authorized to act as a guardian
            </label>
          </div>
        </div>

        {error && <Alert type="error" message={error.message} />}

        <Button
          type="submit"
          loading={loading || status === 'uploading'}
          disabled={documents.length === 0}
          className="w-full"
        >
          Submit for Verification
        </Button>
      </form>
    </div>
  );
}; 