import type { Question } from './assessment';

export interface AssessmentData {
  id: string;
  questions: Question[];
  timeLimit?: number;
  startTime: string;
}

export interface SubmissionData {
  questionId: string;
  answer: string;
  timestamp: string;
}

export interface CompletionData {
  assessmentId: string;
  score: number;
  completionTime: string;
  feedback?: string;
} 