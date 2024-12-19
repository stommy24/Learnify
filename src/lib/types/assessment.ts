import { MathsTopic, EnglishTopic } from './subjects';
import { QuestionType } from './questions';

export interface AssessmentConfig {
  subject: 'maths' | 'english';
  yearGroup: number;
  term: 1 | 2 | 3;
  topics: (MathsTopic | EnglishTopic)[];
  questionCount: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeLimit?: number;
}

export interface AssessmentResult {
  id: string;
  config: AssessmentConfig;
  startedAt: Date;
  completedAt?: Date;
  questions: QuestionAttempt[];
  score?: number;
  feedback?: string;
}

export interface QuestionAttempt {
  questionId: string;
  answer?: string | string[];
  isCorrect?: boolean;
  timeTaken?: number;
  hints?: string[];
} 