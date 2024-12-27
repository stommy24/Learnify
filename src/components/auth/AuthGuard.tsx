import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { UserRole } from '../../features/auth/authSlice';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const location = useLocation();
  const { user, token } = useAppSelector(state => state.auth);

  if (!token || !user) {
    // Redirect to login but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}; 
