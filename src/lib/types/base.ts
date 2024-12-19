// Most basic types that don't depend on anything else
export interface BaseResponse {
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface Identifiable {
  id: string;
}

export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type Subject = 'maths' | 'english';

export type QuestionType = 
  | 'multiple-choice' 
  | 'true-false' 
  | 'short-answer' 
  | 'fill-blank';

export interface BaseMetadata {
  difficulty: number;
  estimatedTime: number;
  curriculumAlignment: number;
} 