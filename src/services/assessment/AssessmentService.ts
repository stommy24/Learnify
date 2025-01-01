import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

interface Assessment {
  id: string;
  userId: string;
  title: string;
  submissions?: Submission[];
}

interface Submission {
  id?: string;
  userId: string;
  assessmentId: string;
  score: number;
}

export class AssessmentService {
  constructor(private api: any) {}

  async createAssessment(assessment: any): Promise<any> {
    try {
      const { data } = await this.api.post('/assessments', assessment);
      return data;
    } catch (error) {
      throw new Error('Failed to create assessment');
    }
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