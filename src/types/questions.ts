import { z } from 'zod';
import type { 
  ValidationStatus, 
  CurriculumMapping, 
  DifficultyLevel 
} from './generation';

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple', 'open', 'numeric']),
  content: z.string(),
  correctAnswer: z.string(),
  options: z.array(z.string()).optional(),
  distractors: z.array(z.string()).optional(),
  explanation: z.string().optional(),
  hints: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  metadata: z.object({
    curriculum: z.any(), // Define proper curriculum schema
    difficulty: z.enum(['easy', 'medium', 'hard']),
    generated: z.string()
  }),
  validation: z.object({
    isValid: z.boolean(),
    validatedAt: z.string(),
    validatedBy: z.string()
  })
});

export type Question = z.infer<typeof questionSchema>; 