import { Assessment, AssessmentQuestion } from './assessment';
import { MasteryProgress, MasteryAttempt } from './mastery';
import type { 
  PlacementTest, 
  PlacementQuestion, 
  PlacementTestStatus,
  PlacementSection,
  QuestionType 
} from './placement';
import { PrismaClient, Prisma, User, Enrollment, StudentProfile, Course } from '@prisma/client';

export type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

export type TransactionClient = Prisma.TransactionClient;

export interface UserWithEnrollments extends User {
  studentProfile: StudentProfile | null;
  authoredCourses: Course[];
}

export type {
  Assessment,
  AssessmentQuestion,
  MasteryProgress,
  MasteryAttempt,
  PlacementTest,
  PlacementQuestion,
  PlacementTestStatus,
  PlacementSection,
  QuestionType
};