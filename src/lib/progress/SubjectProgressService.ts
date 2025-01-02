import prisma from '@/lib/db';

export class SubjectProgressService {
  async getUserProgress(userId: string, subjectId: string) {
    return prisma.progress.findFirst({
      where: {
        userId,
        subjectId
      }
    });
  }

  async updateProgress(userId: string, subjectId: string, progress: number) {
    return prisma.progress.upsert({
      where: {
        userId_subjectId: {
          userId,
          subjectId
        }
      },
      update: {
        currentLevel: progress
      },
      create: {
        userId,
        subjectId,
        currentLevel: 1
      }
    });
  }
} 