import { PrismaClient, Assessment } from '@prisma/client';

export class AssessmentSystem {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    if (!prismaClient) {
      this.prisma = new PrismaClient();
    } else {
      this.prisma = prismaClient;
    }
  }

  async createAssessment(studentId: string, assessmentType: string): Promise<Assessment> {
    return await this.prisma.assessment.create({
      data: {
        assessmentType,
        status: 'IN_PROGRESS',
        userId: studentId
      }
    });
  }

  async getAssessment(assessmentId: string): Promise<Assessment | null> {
    return await this.prisma.assessment.findUnique({
      where: { id: assessmentId }
    });
  }
}

// Export a singleton instance
export const assessmentSystem = new AssessmentSystem(); 