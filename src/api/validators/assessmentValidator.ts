import { z } from 'zod';

const assessmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  subject: z.string().min(1, 'Subject is required'),
  yearGroup: z.number().min(1, 'Year group is required'),
  duration: z.number().min(1, 'Duration is required'),
  totalPoints: z.number().min(1, 'Total points is required'),
  passingScore: z.number().min(0, 'Passing score must be non-negative'),
  questions: z.array(z.object({
    text: z.string().min(1, 'Question text is required'),
    type: z.enum(['multiple-choice', 'essay', 'short-answer']),
    points: z.number().min(1, 'Points must be greater than 0'),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().optional(),
  })).min(1, 'At least one question is required'),
  status: z.enum(['draft', 'published', 'archived']),
  dueDate: z.string().datetime(),
});

export const validateAssessment = (data: unknown, isUpdate = false) => {
  try {
    const schema = isUpdate ? assessmentSchema.partial() : assessmentSchema;
    schema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => err.message),
      };
    }
    return {
      isValid: false,
      errors: ['Invalid assessment data'],
    };
  }
}; 