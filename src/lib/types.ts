// Basic types
export type Subject = 'maths' | 'english';
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'fill-blank';

// Subject-specific types
export type MathsTopic = 'arithmetic' | 'algebra' | 'geometry' | 'statistics';
export type EnglishTopic = 'reading' | 'writing' | 'grammar' | 'vocabulary';

// Core interfaces
export interface Question {
  id: string;
  type: QuestionType;
  topic: MathsTopic | EnglishTopic;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  metadata: {
    difficulty: number;
    yearGroup: number;
    term: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AIQuestionRequest {
  subject: Subject;
  topic: MathsTopic | EnglishTopic;
  yearGroup: number;
  term: number;
  difficulty: number;
  learningObjective: string;
}

export interface AIQuestionMetadata {
  difficulty: number;
  yearGroup: number;
  term: number;
  skillsTested: string[];
}

export interface AIQuestionResponse {
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  metadata: AIQuestionMetadata;
}

export interface AIServiceResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  response?: AIQuestionResponse;
}