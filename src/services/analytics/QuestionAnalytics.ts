import { prisma } from '@/lib/prisma';
import type { Question } from '@/types';

export class QuestionAnalytics {
  async getQuestionUsage(questionId: string) {
    return await prisma.questionAttempt.count({
      where: { questionId }
    });
  }

  async getQuestionValidation(questionId: string) {
    return await prisma.questionValidation.findMany({
      where: { questionId }
    });
  }

  async trackQuestion(question: Question) {
    return await prisma.question.create({
      data: question
    });
  }
} 