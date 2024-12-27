export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple' | 'open' | 'numeric';

export interface CurriculumMapping {
  subject: 'mathematics' | 'english';
  keyStage: number;
  year: number;
  term: number;
  topic: string;
  unit: string;
  learningObjectives: string[];
}

export interface ValidationStatus {
  isValid: boolean;
  validatedAt: string;
  validatedBy: string;
}

export interface GenerationRequest {
  curriculum: CurriculumMapping;
  difficulty: DifficultyLevel;
  count: number;
  preferences: {
    includeHints: boolean;
    includeExplanations: boolean;
  };
}

export interface GenerationStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalQuestions: number;
  generatedQuestions: Question[];
  errors: string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  correctAnswer: string;
  options?: string[];
  distractors?: string[];
  explanation?: string;
  hints?: string[];
  difficulty: DifficultyLevel;
  metadata: {
    curriculum: CurriculumMapping;
    difficulty: DifficultyLevel;
    generated: string;
  };
  validation: ValidationStatus;
} 