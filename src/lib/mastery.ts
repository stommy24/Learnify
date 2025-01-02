import { prisma } from '@/lib/prisma';
import { MasteryProgress, MasteryAttempt, PrismaClient } from '@prisma/client';

interface MasteryAttemptInput {
  studentId: string;
  skillId: string;
  score: number;
  timeSpent: number;
  completedAt: Date;
}

export class MasterySystem {
  constructor(private readonly prisma: PrismaClient = prisma) {}

  async submitAttempt(attempt: MasteryAttemptInput): Promise<MasteryProgress> {
    const record = await this.prisma.masteryRecord.findFirst({
      where: {
        studentId: attempt.studentId,
        skillId: attempt.skillId
      },
      include: {
        masteryAttempts: true
      }
    });

    return {
      id: record?.id || '',
      studentId: attempt.studentId,
      topicId: attempt.skillId,
      consecutiveSuccesses: record?.masteryAttempts?.length || 0,
      lastAttemptDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getStudentProgress(studentId: string, skillId: string): Promise<MasteryProgress | null> {
    const record = await this.prisma.masteryRecord.findFirst({
      where: {
        studentId,
        skillId
      },
      include: {
        masteryAttempts: true
      }
    });

    if (!record) return null;

    return {
      id: record.id,
      studentId: record.studentId,
      topicId: record.skillId,
      consecutiveSuccesses: record.masteryAttempts.length,
      lastAttemptDate: new Date(),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }
}

// Export a singleton instance
export const masterySystem = new MasterySystem(); 