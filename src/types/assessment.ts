import { Prisma } from '@prisma/client';

export enum AssessmentType {
  PLACEMENT = 'PLACEMENT',
  LEVEL_END = 'LEVEL_END',
  PRACTICE = 'PRACTICE',
  DIAGNOSTIC = 'DIAGNOSTIC'
}

export enum QuestionFormat {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT_INPUT = 'TEXT_INPUT',
  DRAWING = 'DRAWING',
  EQUATION_BUILDER = 'EQUATION_BUILDER',
  DRAG_DROP = 'DRAG_DROP',
  NUMERIC = 'NUMERIC'
}

export interface Question {
  id: string;
  content: string;
  type: QuestionFormat;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: number;
}

export interface Assessment {
  id: string;
  type: AssessmentType;
  questions: Question[];
  userId: string;
  subjectId: string;
  score?: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentQuestion extends Question {
  assessmentId: string;
  order: number;
}

export interface SkillLevel {
  subject: string;
  level: number;
  confidence: number;
  lastUpdated: Date;
}

export interface AssessmentResult {
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
  learningStyle?: string;
}