export interface BaseIdentifier {
  id: string;
  name: string;
  accountType: 'teacher' | 'learner' | 'guardian';
}

export interface TeacherIdentifier extends BaseIdentifier {
  accountType: 'teacher';
  subjects: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  schoolAffiliation: string;
}

export interface LearnerIdentifier extends BaseIdentifier {
  accountType: 'learner';
  grade: string;
}

export interface GuardianIdentifier extends BaseIdentifier {
  accountType: 'guardian';
  children: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export type UserIdentifier = TeacherIdentifier | LearnerIdentifier | GuardianIdentifier;