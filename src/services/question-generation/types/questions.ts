export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multipleChoice' | 'fillInBlank' | 'openEnded' | 'mathematical';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  answer: string;
  distractors?: string[];
  explanation?: string;
  hints?: string[];
  metadata: QuestionMetadata;
  validation: QuestionValidation;
}

export interface QuestionMetadata {
  curriculum: CurriculumMapping;
  difficulty: DifficultyLevel;
  generated: string;
  lastUsed?: string;
  usageCount: number;
  successRate?: number;
  averageCompletionTime?: number;
  discriminationIndex?: number;
}

export interface QuestionValidation {
  isValid: boolean;
  validatedAt: string;
  validatedBy: 'system' | 'human';
  issues?: ValidationIssue[];
}

export interface ValidationIssue {
  type: 'curriculum' | 'difficulty' | 'language' | 'technical';
  severity: 'low' | 'medium' | 'high';
  description: string;
} 