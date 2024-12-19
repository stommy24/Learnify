import { PrismaClient } from '@prisma/client';
import type { CheckpointRule, CheckpointAttempt } from '@/types/checkpoint';
import { CheckpointError, CheckpointErrorCode } from '@/types/checkpoint';

export class CheckpointSystem {
  constructor(private prisma: PrismaClient) {}

  async evaluateCheckpoint(
    userId: string,
    topic: string,
    area: string,
    level: string,
    score: number
  ): Promise<CheckpointAttempt> {
    try {
      const rules = await this.prisma.checkpointRules.findFirst({
        where: { topic, area, level }
      });

      if (!rules) {
        throw new CheckpointError(
          CheckpointErrorCode.RULES_NOT_FOUND,
          `No checkpoint rules found for ${topic} in ${area} at ${level} level`
        );
      }

      const attempt = await this.prisma.checkpointAttempt.create({
        data: {
          userId,
          checkpointId: rules.id,
          score,
          completed: score >= rules.minScore,
          timestamp: new Date()
        }
      });

      if (score < rules.minScore) {
        await this.generateRemedialContent(userId, topic, area, level);
      }

      return attempt;
    } catch (error) {
      if (error instanceof CheckpointError) {
        throw error;
      }
      throw new CheckpointError(
        CheckpointErrorCode.CHECKPOINT_EVALUATION_ERROR,
        'Failed to evaluate checkpoint'
      );
    }
  }

  private async generateRemedialContent(
    userId: string,
    topic: string,
    area: string,
    level: string
  ): Promise<void> {
    try {
      // Implementation for generating remedial content
      await this.prisma.remedialContent.create({
        data: {
          userId,
          topic,
          area,
          level,
          status: 'pending',
          createdAt: new Date()
        }
      });
    } catch (error) {
      throw new CheckpointError(
        CheckpointErrorCode.REMEDIAL_GENERATION_ERROR,
        'Failed to generate remedial content'
      );
    }
  }

  async getCheckpointProgress(
    userId: string,
    topic: string
  ): Promise<CheckpointAttempt[]> {
    try {
      return await this.prisma.checkpointAttempt.findMany({
        where: {
          userId,
          checkpoint: {
            topic
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });
    } catch (error) {
      throw new CheckpointError(
        CheckpointErrorCode.CHECKPOINT_EVALUATION_ERROR,
        'Failed to fetch checkpoint progress'
      );
    }
  }
} 