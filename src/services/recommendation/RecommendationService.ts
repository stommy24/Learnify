import { PrismaClient } from '@prisma/client';

export class RecommendationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async generateRecommendations(userId: string) {
    // Get user's assessment results
    const assessmentResults = await this.getRecentAssessmentResults(userId);
    
    // Get user's current subjects
    const userSubjects = await this.getUserSubjects(userId);
    
    // Analyze weak areas
    const weakAreas = this.analyzeWeakAreas(assessmentResults);
    
    // Generate recommendations
    const recommendations = await Promise.all(
      weakAreas.map(area => this.createRecommendation(userId, area))
    );

    return recommendations;
  }

  async getUserRecommendations(userId: string) {
    return this.prisma.recommendation.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        priority: 'desc'
      }
    });
  }

  private async getRecentAssessmentResults(userId: string) {
    return this.prisma.assessmentSubmission.findMany({
      where: {
        userId,
        submittedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        assessment: true
      }
    });
  }

  private async getUserSubjects(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            subject: true
          }
        }
      }
    });

    return user?.enrollments.map(e => e.subject) || [];
  }

  private analyzeWeakAreas(assessmentResults: any[]) {
    const subjectScores: Record<string, { total: number; count: number }> = {};

    // Calculate average scores per subject
    assessmentResults.forEach(result => {
      const subjectId = result.assessment.subjectId;
      if (!subjectScores[subjectId]) {
        subjectScores[subjectId] = { total: 0, count: 0 };
      }
      subjectScores[subjectId].total += result.score;
      subjectScores[subjectId].count += 1;
    });

    // Identify subjects with average score below 70%
    const weakAreas = Object.entries(subjectScores)
      .map(([subjectId, scores]) => ({
        subjectId,
        averageScore: scores.total / scores.count
      }))
      .filter(area => area.averageScore < 70);

    return weakAreas;
  }

  private async createRecommendation(userId: string, weakArea: { subjectId: string; averageScore: number }) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: weakArea.subjectId }
    });

    if (!subject) return null;

    return this.prisma.recommendation.create({
      data: {
        userId,
        type: 'study',
        subject: subject.name,
        title: `Improve ${subject.name}`,
        description: `Based on your recent assessments, we recommend focusing on ${subject.name}. Your average score is ${Math.round(weakArea.averageScore)}%.`,
        priority: weakArea.averageScore < 50 ? 'high' : 'medium',
        reason: `Recent assessment performance: ${Math.round(weakArea.averageScore)}%`,
        expiresAt: this.getExpiryDate()
      }
    });
  }

  private getExpiryDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Recommendations expire after 7 days
    return date;
  }
} 