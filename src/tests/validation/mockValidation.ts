import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['multiple', 'open', 'numeric']),
  content: z.string().min(1),
  correctAnswer: z.string(),
  points: z.number().int().min(1).max(5),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topic: z.string(),
  metadata: z.object({
    created: z.string().datetime(),
    author: z.string(),
    version: z.string()
  }).optional()
});

export class MockDataValidator {
  static validateQuestion(question: unknown) {
    return questionSchema.parse(question);
  }

  static validateBulkData(data: unknown) {
    const bulkSchema = z.object({
      questions: z.array(questionSchema),
      results: z.array(z.any()),
      scoreCards: z.array(z.any()),
      metrics: z.array(z.any())
    });

    return bulkSchema.parse(data);
  }
} 