import React, { useState } from 'react';
import { useRBAC } from '@/lib/rbac/RBACProvider';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { TeacherDocument } from '@/types/rbac';

export const TeacherVerification: React.FC = () => {
  const { updateVerificationStatus, loading, error } = useRBAC();
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<TeacherDocument>('QTS');
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
        <h2 className="text-2xl font-bold">Teacher Verification</h2>
        <p className="mt-2 text-gray-600">
          Please provide your teaching credentials for verification
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Document Type
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as TeacherDocument)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="QTS">Qualified Teacher Status (QTS)</option>
            <option value="PGCE">PGCE Certificate</option>
            <option value="Other">Other Teaching Qualification</option>
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
            Accepted formats: PDF, JPG, PNG
          </p>
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
