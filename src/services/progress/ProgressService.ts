import { prisma } from '@/lib/prisma';
import { Progress, Status } from '@prisma/client';

export class ProgressService {
  static async updateProgress(userId: string, subjectId: string, data: Partial<Progress>) {
    return prisma.progress.upsert({
      where: {
        userId_subjectId: {
          userId,
          subjectId
        }
      },
      update: data,
      create: {
        userId,
        subjectId,
        status: Status.IN_PROGRESS,
        ...data
      }
    });
  }

  static async getUserProgress(userId: string) {
    return prisma.progress.findMany({
      where: { userId },
      include: {
        subject: true
      }
    });
  }

  static async calculateCompletionRate(userId: string) {
    const progress = await this.getUserProgress(userId);
    const completed = progress.filter(p => p.status === Status.COMPLETED);
    return (completed.length / progress.length) * 100;
  }
} 