export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'NUMERIC';
export enum QuestionFormat {
  MULTIPLE_CHOICE = 'multiple-choice',
  TEXT_INPUT = 'text',
  NUMERIC = 'numeric',
  DRAWING = 'drawing'
}

export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  answer: string;
  options?: string[];
  explanation?: string;
  difficulty: number;
  metadata?: {
    generationMethod?: 'AI' | 'TEMPLATE';
    templateId?: string;
    aiModel?: string;
  };
} 