import type { QuestionType } from '@/types/curriculum';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  template: string;
  correctAnswer: string;
  options?: string[];
  points: number;
  validationRules: {
    type: 'exact' | 'pattern' | 'range';
    value: string | { min: number; max: number };
  }[];
  scaffolding?: {
    hint: string;
    condition?: string;
  }[];
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  explanation?: string;
  hints?: string[];
  tolerance?: number; // For numeric questions
  rubric?: string[]; // For open-ended questions
  metadata?: {
    created: string;
    author: string;
    version: string;
  };
}

export interface Answer {
  content: string;
  timestamp: string;
}

export interface AssessmentResult {
  id: string;
  questionId: string;
  question: {
    topic: string;
    type: string;
    points: number;
    content?: string;
  };
  answer?: string;
  score: number;
  isCorrect: boolean;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  timestamp: Date;
  feedback: string[];
  mistakePatterns?: string[];
  topicPerformance: {
    topic: string;
    score: number;
    questionsCount: number;
  }[];
}

export interface ScoreCard {
  userId: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  timestamp: string;
  totalPoints: number;
  maxPoints: number;
  percentage: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PerformanceMetrics extends Record<string, unknown> {
  userId: string;
  topic: string;
  score: number;
  timeSpent: number;
  timestamp: string;
  difficulty: Difficulty;
  mistakes: number;
  recommendedFocus: string[];
}

export interface AnalyticsData {
  overallProgress: number;
  topicStrengths: Record<string, number>;
  learningTrends: Array<{
    date: string;
    score: number;
  }>;
  recommendedActions: string[];
} 