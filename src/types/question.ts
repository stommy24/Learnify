export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'NUMERIC';

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