import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { Assessment, Submission } from '@prisma/client';

export class AssessmentService {
  static async createAssessment(data: Partial<Assessment>) {
    return prisma.assessment.create({
      data: data as any
    });
  }

  static async getAssessments(userId: string, filters: any) {
    const cacheKey = `assessments:${userId}:${JSON.stringify(filters)}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const assessments = await prisma.assessment.findMany({
      where: {
        userId,
        ...filters
      },
      include: {
        submissions: true
      }
    });

    await redis.setex(cacheKey, 300, JSON.stringify(assessments)); // Cache for 5 minutes
    return assessments;
  }

  static async submitAssessment(data: Partial<Submission>) {
    const submission = await prisma.submission.create({
      data: data as any
    });

    // Calculate and update user points
    await prisma.user.update({
      where: { id: data.userId as string },
      data: {
        points: {
          increment: submission.score
        }
      }
    });

    return submission;
  }
} 