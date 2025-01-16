import { PrismaClient } from '@prisma/client';

export interface MasteryProgress {
  id: string;
  studentId: string;
  topicId: string;
  consecutiveSuccesses: number;
  lastAttemptDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MasteryAttemptInput {
  userId: string;
  score: number;
  timeSpent: number;
}

export class MasterySystem {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    if (!prismaClient) {
      this.prisma = new PrismaClient();
    } else {
      this.prisma = prismaClient;
    }
  }

  async submitAttempt(attempt: MasteryAttemptInput): Promise<MasteryProgress> {
    const { userId, score, timeSpent } = attempt;

    // Find or create mastery progress
    const progress = await this.prisma.masteryProgress.upsert({
      where: {
        id: userId // Using userId as the unique identifier
      },
      create: {
        id: userId,
        studentId: userId,
        topicId: 'default', // You might want to make this configurable
        consecutiveSuccesses: score >= 80 ? 1 : 0,
        lastAttemptDate: new Date()
      },
      update: {
        consecutiveSuccesses: score >= 80 ? {
          increment: 1
        } : {
          set: 0
        },
        lastAttemptDate: new Date()
      }
    });

    return {
      id: progress.id,
      studentId: progress.studentId,
      topicId: progress.topicId,
      consecutiveSuccesses: progress.consecutiveSuccesses,
      lastAttemptDate: progress.lastAttemptDate,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt
    };
  }
}

// Export a singleton instance
export const masterySystem = new MasterySystem(); 