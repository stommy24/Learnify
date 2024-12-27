import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  TeacherIdentifier, 
  LearnerIdentifier, 
  GuardianIdentifier,
  TeacherPermissions,
  LearnerPermissions,
  GuardianPermissions
} from '@/types/rbac';

interface RBACState {
  role: 'teacher' | 'learner' | 'guardian' | null;
  identifier: TeacherIdentifier | LearnerIdentifier | GuardianIdentifier | null;
  permissions: TeacherPermissions | LearnerPermissions | GuardianPermissions | null;
  loading: boolean;
  error: Error | null;
}

interface RBACContextType extends RBACState {
  checkPermission: (permission: string) => boolean;
  hasAccess: (resource: string, action: string) => boolean;
  verifyAge: (dateOfBirth: Date) => Promise<void>;
  updateVerificationStatus: (documents: File[]) => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<RBACState>({
    role: null,
    identifier: null,
    permissions: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        role: roleData.role,
        identifier: roleData.identifier,
        permissions: roleData.permissions,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        loading: false
      }));
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (!state.permissions) return false;
    
    const [category, action] = permission.split('.');
    return state.permissions[category]?.[action] ?? false;
  };

  const hasAccess = (resource: string, action: string): boolean => {
    if (!state.role || !state.permissions) return false;

    // Check role-specific restrictions
    const restrictions = {
      teacher: ['accessPersonalData', 'contactLearners'],
      guardian: ['modifyContent', 'contactOtherUsers'],
      learner: ['contactOthers', 'sharePersonalInfo']
    };

    if (restrictions[state.role]?.includes(`${resource}.${action}`)) {
      return false;
    }

    return checkPermission(`${resource}.${action}`);
  };

  const verifyAge = async (dateOfBirth: Date): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const age = new Date().getFullYear() - dateOfBirth.getFullYear();
      let ageGroup: AgeGroup;
      
      if (age < 13) ageGroup = 'under13';
      else if (age < 16) ageGroup = '13-16';
      else if (age < 18) ageGroup = '16-18';
      else ageGroup = 'adult';

      const { error } = await supabase
        .from('user_roles')
        .update({
          identifier: {
            ...state.identifier,
            ageGroup,
            verifiedAge: true
          }
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        identifier: {
          ...prev.identifier,
          ageGroup,
          verifiedAge: true
        }
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateVerificationStatus = async (documents: File[]): Promise<void> => {
    // Implementation for document verification
    // This would typically involve:
    // 1. Upload documents to secure storage
    // 2. Trigger verification process
    // 3. Update verification status
  };

  return (
    <RBACContext.Provider
      value={{
        ...state,
        checkPermission,
        hasAccess,
        verifyAge,
        updateVerificationStatus
      }}
    >
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
}; 
