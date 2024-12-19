import { Question } from './questions';
import { AssessmentConfig } from './assessment';

export interface QuizConfig extends AssessmentConfig {
  adaptiveDifficulty?: boolean;
  allowHints?: boolean;
  showFeedback?: boolean;
  randomizeOrder?: boolean;
}

export interface GeneratedQuiz {
  id: string;
  config: QuizConfig;
  questions: Question[];
  metadata: QuizMetadata;
}

export interface QuizMetadata {
  generatedAt: Date;
  difficulty: number;
  estimatedTime: number;
  topicsCovered: string[];
  curriculumAlignment: number;
  skillsAssessed?: string[];
  prerequisites?: string[];
}

export interface QuizAttempt {
  quizId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    timeTaken: number;
  }[];
  score?: number;
  feedback?: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  timeSpent: number;
  accuracy: number;
  topicPerformance: {
    topic: string;
    score: number;
    questions: number;
  }[];
  recommendations: string[];
} 