import { z } from 'zod';

export const QuestionSchema = z.object({
  content: z.string(),
  type: z.enum(['multipleChoice', 'fillInBlank', 'openEnded', 'mathematical']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  answer: z.string(),
  distractors: z.array(z.string()).optional(),
  hints: z.array(z.string()).optional(),
  explanation: z.string().optional(),
});

export type QuestionType = z.infer<typeof QuestionSchema>; 

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'open-ended' | 'true-false';
  difficulty: 'easy' | 'medium' | 'hard';
  metadata: {
    subject?: string;
    topic?: string;
    subtopic?: string;
    grade?: string;
    lastModified?: string;
    author?: string;
  };
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  tags: string[];
} 