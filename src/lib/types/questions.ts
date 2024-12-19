import { 
  Identifiable, 
  QuestionType,
  BaseMetadata 
} from './base';
import { Topic } from './subjects';

export interface Question extends Identifiable {
  type: QuestionType;
  topic: Topic;
  content: QuestionContent;
  metadata: QuestionMetadata;
}

export interface QuestionContent {
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  hints?: string[];
}

export interface QuestionMetadata extends BaseMetadata {
  yearGroup: number;
  term: number;
  skillsTested?: string[];
}

export interface QuestionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface QuestionAttempt extends Identifiable {
  questionId: string;
  answer?: string | string[];
  isCorrect?: boolean;
  timeTaken?: number;
  hintsUsed: string[];
  attempts: number;
} 