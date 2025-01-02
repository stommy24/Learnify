import { prisma } from '@/lib/prisma';
import { Assessment, Prisma } from '@prisma/client';

export class AssessmentSystem {
  async createAssessment(studentId: string, assessmentType: string): Promise<Assessment> {
    return await prisma.assessment.create({
      data: {
        assessmentType,
        status: 'IN_PROGRESS',
        user: { connect: { id: studentId } },
        currentQuestionIndex: 0,
        score: 0,
        timeSpent: 0
      }
    });
  }

  async getAssessment(assessmentId: string): Promise<Assessment | null> {
    return await prisma.assessment.findUnique({
      where: { id: assessmentId }
    });
  }

  async submitAnswer(
    assessmentId: string, 
    answer: string, 
    timeSpent: number
  ): Promise<Assessment> {
    const assessment = await this.getAssessment(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    return await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        score: { increment: 1 },
        timeSpent: { increment: timeSpent },
        currentQuestionIndex: { increment: 1 }
      }
    });
  }

  async startAssessment(studentId: string, type: string): Promise<Assessment> {
    return this.createAssessment(studentId, type);
  }
}

// Export a singleton instance
export const assessmentSystem = new AssessmentSystem(); 