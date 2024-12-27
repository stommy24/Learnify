import { Question, QuestionType } from '@/lib/types/quiz';
import { AssessmentResult } from '@/lib/types/assessment';

export interface AssessmentViewProps {
  questions: Question[];
  onComplete: (result: AssessmentResult) => void;
  onProgress?: (progress: AssessmentProgress) => void;
  initialState?: AssessmentState;
  config?: AssessmentConfig;
}

export interface AssessmentProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  timeSpent: number;
  answers: string[];
  isComplete: boolean;
}

export interface AssessmentState {
  answers: string[];
  currentIndex: number;
  startTime: Date;
  timeSpent: number;
  feedback?: AssessmentFeedback[];
}

export interface AssessmentConfig {
  allowNavigation: boolean;
  showFeedback: boolean;
  timeLimit?: number;
  adaptiveDifficulty: boolean;
  questionTypes: QuestionType[];
}

export interface AssessmentFeedback {
  questionId: string;
  isCorrect: boolean;
  message: string;
  helpfulLinks?: string[];
  suggestedTopics?: string[];
}

export type AssessmentStatus = 'not_started' | 'in_progress' | 'completed' | 'timed_out'; 