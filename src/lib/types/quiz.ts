import { AssessmentConfig } from './assessment';

export type QuestionType = 
  | 'multiple-choice'
  | 'true-false'
  | 'short-answer'
  | 'essay'
  | 'matching';

export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  options?: string[];
  difficulty: number;
  topic: string;
  subject: string;
  explanation?: string;
  type: QuestionType;
}

export interface QuizConfig {
  topics: string[];
  yearGroup: number;
  term: 1 | 2 | 3;
  difficulty: 1 | 2 | 3 | 4 | 5;
  subject: string;
  questionCount: number;
}

export interface GeneratedQuiz {
  id: string;
  questions: Question[];
  config: QuizConfig;
  createdAt: Date;
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