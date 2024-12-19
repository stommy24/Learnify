export type UserRole = 'teacher' | 'learner' | 'guardian';

export interface BaseIdentifier {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ageGroup?: number;
}

export interface TeacherIdentifier extends BaseIdentifier {
  role: 'teacher';
  subjects: string[];
  qualifications: string[];
}

export interface LearnerIdentifier extends BaseIdentifier {
  role: 'learner';
  grade: number;
  ageGroup: number;
  guardianId?: string;
}

export interface GuardianIdentifier extends BaseIdentifier {
  role: 'guardian';
  learnerIds: string[];
}

export type UserIdentifier = TeacherIdentifier | LearnerIdentifier | GuardianIdentifier; 