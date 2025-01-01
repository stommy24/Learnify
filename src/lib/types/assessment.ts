import { Question, QuestionType } from './quiz';

export interface AssessmentResult {
  id: string;
  questionId: string;
  question: Question;
  answer: string;
  isCorrect: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  startedAt: Date;
  timestamp?: Date;
  feedback: string[];
  config: AssessmentConfig;
  questions: Question[];
  objectiveId?: string;
  mistakePatterns?: string[];
  topicPerformance?: TopicPerformance[];
  currentQuestion: number;
  completed: boolean;
}

export interface TopicPerformance {
  topic: string;
  score: number;
  questionsCount: number;
}

export interface AssessmentConfig {
  topics: string[];
  yearGroup: number;
  term: number;
  difficulty: number;
  subject: string;
  questionCount: number;
  timeLimit?: number;
  allowNavigation: boolean;
  showFeedback: boolean;
  adaptiveDifficulty: boolean;
  questionTypes: QuestionType[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
} 

export type { Question };
