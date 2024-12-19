// Core RBAC types
export type AccountType = 'independent' | 'supervised';
export type AgeGroup = 'under13' | '13-16' | '16-18' | 'adult';
export type VerificationMethod = 'ID' | 'Address' | 'Other';
export type TeacherDocument = 'QTS' | 'PGCE' | 'Other';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface TeacherIdentifier {
  teacherId: string;
  verificationStatus: {
    verified: boolean;
    documentType?: TeacherDocument;
    dateVerified?: Date;
    verificationExpiry?: Date;
  };
  schoolAffiliation?: {
    schoolId: string;
    position: string;
    verified: boolean;
  };
}

export interface LearnerIdentifier {
  learnerId: string;
  accountType: AccountType;
  ageGroup?: AgeGroup;
  verifiedAge: boolean;
}

export interface GuardianIdentifier {
  guardianId: string;
  verificationStatus: {
    verified: boolean;
    method: VerificationMethod;
    dateVerified?: Date;
  };
}

// Role-specific permissions and capabilities
export interface TeacherPermissions {
  students: {
    view: boolean;
    assign: boolean;
    monitor: boolean;
  };
  content: {
    view: boolean;
    create: boolean;
    customize: boolean;
  };
  analytics: {
    viewClass: boolean;
    viewIndividual: boolean;
    export: boolean;
  };
}

export interface LearnerPermissions {
  content: {
    access: boolean;
    practice: boolean;
    trackProgress: boolean;
  };
  assignments: {
    view: boolean;
    submit: boolean;
    review: boolean;
  };
}

export interface GuardianPermissions {
  supervised: {
    view: boolean;
    manage: boolean;
    monitor: boolean;
  };
  content: {
    view: boolean;
    monitor: boolean;
  };
} 