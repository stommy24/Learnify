import React, { useState } from 'react';
import { useRBAC } from '@/lib/rbac/RBACProvider';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';

interface RoleAssignmentProps {
  onComplete: (role: string) => void;
}

export const RoleAssignment: React.FC<RoleAssignmentProps> = ({ onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showVerification, setShowVerification] = useState(false);
  const { loading, error } = useRBAC();

  const roles = [
    {
      id: 'learner',
      title: 'Learner',
      description: 'Access educational content and track your progress',
      requiresVerification: false
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Create content and monitor student progress',
      requiresVerification: true
    },
    {
      id: 'guardian',
      title: 'Guardian',
      description: 'Monitor and manage supervised learners',
      requiresVerification: true
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    const role = roles.find(r => r.id === roleId);
    if (role?.requiresVerification) {
      setShowVerification(true);
    } else {
      onComplete(roleId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Role</h2>
        <p className="mt-2 text-gray-600">
          Select the role that best describes how you'll use the platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className={`
              p-4 rounded-lg border text-left transition
              ${selectedRole === role.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'}
            `}
          >
            <h3 className="font-medium">{role.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{role.description}</p>
            {role.requiresVerification && (
              <span className="mt-2 inline-block text-xs text-gray-500">
                Requires verification
              </span>
            )}
          </button>
        ))}
      </div>

      {error && <Alert type="error" message={error.message} />}

      {showVerification && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            This role requires verification. You'll be guided through the verification process.
          </p>
          <Button
            onClick={() => onComplete(selectedRole)}
            loading={loading}
            className="mt-4"
          >
            Continue to Verification
          </Button>
        </div>
      )}
    </div>
  );
}; 