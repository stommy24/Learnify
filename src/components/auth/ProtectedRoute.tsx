import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth/AuthProvider';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/auth/login'
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
      return;
    }

    if (requiredRole && user?.user_metadata.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, router, redirectTo, requiredRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}; 
