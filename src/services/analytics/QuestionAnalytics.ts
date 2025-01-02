import prisma from '@/lib/db';
import { Question } from '@/types/assessment';

export class QuestionAnalytics {
  async trackAttempt(questionId: string, userId: string, isCorrect: boolean) {
    return await prisma.questionAttempt.create({
      data: {
        questionId,
        userId,
        isCorrect,
        timestamp: new Date()
      }
    });
  }

  async validateQuestion(question: Question) {
    return await prisma.questionValidation.create({
      data: {
        questionId: question.id,
        content: question.content,
        type: question.type,
        difficulty: question.difficulty,
        validatedAt: new Date()
      }
    });
  }
}