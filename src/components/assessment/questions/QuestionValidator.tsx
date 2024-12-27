import { z } from 'zod';
import type { Question } from '@/types/assessment';
import type { QuestionType } from '@/types/curriculum';

const validationSchemas: Record<QuestionType, z.ZodType> = {
  'multiple-choice': z.string(),
  'true-false': z.string(),
  'short-answer': z.string(),
  'numeric': z.number(),
  'open-ended': z.string()
} as const;

export class QuestionValidator {
  static validate(question: Question, arg1: string): any {
    throw new Error('Method not implemented.');
  }

  validateAnswer(type: QuestionType, answer: unknown) {
    const schema = validationSchemas[type];
    if (!schema) {
      return { success: false, error: new Error('Invalid question type') };
    }
    return schema.safeParse(type === 'numeric' ? Number(answer) : answer);
  }
} 
