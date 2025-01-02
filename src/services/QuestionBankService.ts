import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';

interface QuestionStats {
  totalAttempts: number;
  correctAttempts: number;
  averageTime: number;
  successRate: number;
}

export class QuestionBankService {
  async updateQuestionConfidence(
    questionId: string,
    stats: QuestionStats
  ): Promise<void> {
    try {
      const baseConfidence = 0.5;
      const successWeight = 0.3;
      const timeWeight = 0.2;
      const attemptsWeight = 0.1;

      // Calculate confidence modifiers
      const successModifier = (stats.successRate - 0.5) * successWeight;
      const timeModifier = this.calculateTimeModifier(stats.averageTime) * timeWeight;
      const attemptsModifier = Math.min(stats.totalAttempts / 100, 1) * attemptsWeight;

      const newConfidence = Math.min(
        0.95,
        baseConfidence + successModifier + timeModifier + attemptsModifier
      );

      await prisma.questionBank.update({
        where: { id: questionId },
        data: {
          confidence: newConfidence,
          successRate: stats.successRate,
          metadata: {
            update: {
              stats: {
                totalAttempts: stats.totalAttempts,
                correctAttempts: stats.correctAttempts,
                averageTime: stats.averageTime
              }
            }
          }
        }
      });
    } catch (error) {
      logger.error('Failed to update question confidence', {
        questionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async maintainQuestionBank(): Promise<void> {
    try {
      // Remove low-performing questions
      await prisma.questionBank.deleteMany({
        where: {
          AND: [
            { usageCount: { gt: 10 } },
            { confidence: { lt: 0.3 } }
          ]
        }
      });

      // Flag questions for review
      await prisma.questionBank.updateMany({
        where: {
          OR: [
            { successRate: { lt: 0.2 } },
            { 
              usageCount: { gt: 5 },
              confidence: { lt: 0.4 }
            }
          ]
        },
        data: {
          status: 'NEEDS_REVIEW'
        }
      });

      // Archive old questions
      await prisma.questionBank.updateMany({
        where: {
          lastUsed: {
            lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days
          }
        },
        data: {
          status: 'ARCHIVED'
        }
      });
    } catch (error) {
      logger.error('Failed to maintain question bank', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private calculateTimeModifier(averageTime: number): number {
    // Implementation of time-based confidence adjustment
    const expectedTime = 60; // 60 seconds as baseline
    const deviation = Math.abs(averageTime - expectedTime) / expectedTime;
    return Math.max(0, 1 - deviation);
  }
} 