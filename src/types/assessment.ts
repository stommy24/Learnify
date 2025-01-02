import { Prisma } from '@prisma/client';

export type AssessmentType = 'PLACEMENT' | 'DIAGNOSTIC' | 'PROGRESS';
export type AssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type SkillLevel = 'NOVICE' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Assessment {
  id: string;
  type: AssessmentType;
  status: AssessmentStatus;
  studentId: string;
  currentQuestionIndex: number;
  score: number;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
  questions?: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  skillId: string;
  difficulty: number;
  content: string;
  correctAnswer: string;
  points: number;
  timeLimit?: number;
  createdAt: Date;
  updatedAt: Date;
  assessment?: Assessment;
}

export interface AssessmentWithQuestions extends Assessment {
  questions: AssessmentQuestion[];
}

export const SkillLevels: Record<SkillLevel, number> = {
  NOVICE: 1,
  BEGINNER: 2,
  INTERMEDIATE: 3,
  ADVANCED: 4,
  EXPERT: 5
};