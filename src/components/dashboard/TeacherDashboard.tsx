import React from 'react';
import { useRBAC } from '@/lib/rbac/RBACProvider';
import { Card } from '../common/Card';
import { TabGroup } from '../common/TabGroup';
import { Button } from '../common/Button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui';
import type { TeacherIdentifier } from '@/types/users';

export function TeacherDashboard({ user }: { user: TeacherIdentifier }) {
  if (user.verificationStatus !== 'verified') {
    return (
      <Alert variant="warning">
        <AlertTitle>Verification Required</AlertTitle>
        <AlertDescription>
          Please complete the verification process to access all teacher features.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>School: {user.schoolAffiliation}</p>
      {/* ... rest of the component */}
    </div>
  );
} 