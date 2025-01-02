import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';

interface LearningMetrics {
  totalTimeSpent: number;
  averageSessionLength: number;
  completionRate: number;
  masteryLevel: number;
  conceptProgress: Record<string, number>;
  recentActivity: ActivitySummary[];
  strengths: string[];
  areasForImprovement: string[];
}

interface ActivitySummary {
  date: Date;
  type: 'LESSON' | 'PRACTICE' | 'ASSESSMENT';
  timeSpent: number;
  conceptsCovered: string[];
  performance: number;
}

interface ProgressReport {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  metrics: LearningMetrics;
  trends: {
    timeSpent: number[];
    performance: number[];
    mastery: number[];
  };
  recommendations: string[];
}

export class AnalyticsService {
  async getUserAnalytics(userId: string): Promise<LearningMetrics> {
    try {
      const [
        sessions,
        assessments,
        progress
      ] = await Promise.all([
        prisma.learningSession.findMany({
          where: { userId },
          orderBy: { startedAt: 'desc' },
          take: 30 // Last 30 sessions
        }),
        prisma.assessmentSession.findMany({
          where: { userId },
          include: { assessment: true }
        }),
        prisma.userProgress.findMany({
          where: { userId },
          include: { concept: true }
        })
      ]);

      const timeMetrics = this.calculateTimeMetrics(sessions);
      const masteryMetrics = this.calculateMasteryMetrics(progress);
      const activitySummary = this.summarizeRecentActivity(sessions, assessments);

      return {
        ...timeMetrics,
        ...masteryMetrics,
        recentActivity: activitySummary,
        strengths: this.identifyStrengths(progress),
        areasForImprovement: this.identifyWeaknesses(progress)
      };
    } catch (error) {
      logger.error('Failed to generate user analytics', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async generateProgressReport(
    userId: string,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  ): Promise<ProgressReport> {
    try {
      const startDate = this.getStartDate(period);
      
      const [
        sessions,
        assessments,
        progress
      ] = await Promise.all([
        prisma.learningSession.findMany({
          where: {
            userId,
            startedAt: { gte: startDate }
          }
        }),
        prisma.assessmentSession.findMany({
          where: {
            userId,
            startedAt: { gte: startDate }
          },
          include: { assessment: true }
        }),
        prisma.userProgress.findMany({
          where: { userId },
          include: { concept: true }
        })
      ]);

      const metrics = await this.getUserAnalytics(userId);
      const trends = this.calculateTrends(sessions, assessments, period);
      const recommendations = await this.generateRecommendations(
        metrics,
        trends,
        progress
      );

      return {
        period,
        metrics,
        trends,
        recommendations
      };
    } catch (error) {
      logger.error('Failed to generate progress report', {
        userId,
        period,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private calculateTimeMetrics(sessions: any[]): {
    totalTimeSpent: number;
    averageSessionLength: number;
  } {
    const totalTimeSpent = sessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    return {
      totalTimeSpent,
      averageSessionLength: totalTimeSpent / (sessions.length || 1)
    };
  }

  private calculateMasteryMetrics(progress: any[]): {
    masteryLevel: number;
    conceptProgress: Record<string, number>;
    completionRate: number;
  } {
    const conceptProgress = progress.reduce(
      (acc, p) => ({
        ...acc,
        [p.concept.id]: p.masteryLevel
      }),
      {}
    );

    const masteryLevel = Object.values(conceptProgress).reduce(
      (sum: number, level: number) => sum + level,
      0
    ) / (Object.keys(conceptProgress).length || 1);

    const completionRate = progress.filter(p => p.completed).length / 
      (progress.length || 1);

    return {
      masteryLevel,
      conceptProgress,
      completionRate
    };
  }

  private summarizeRecentActivity(
    sessions: any[],
    assessments: any[]
  ): ActivitySummary[] {
    const activities: ActivitySummary[] = [
      ...sessions.map(session => ({
        date: session.startedAt,
        type: session.type,
        timeSpent: session.duration,
        conceptsCovered: session.conceptsCovered,
        performance: session.performance || 0
      })),
      ...assessments.map(assessment => ({
        date: assessment.startedAt,
        type: 'ASSESSMENT',
        timeSpent: assessment.duration,
        conceptsCovered: assessment.assessment.concepts,
        performance: assessment.score || 0
      }))
    ];

    return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private calculateTrends(
    sessions: any[],
    assessments: any[],
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  ) {
    const timePoints = this.groupByPeriod(
      sessions,
      period,
      session => session.duration
    );

    const performancePoints = this.groupByPeriod(
      assessments,
      period,
      assessment => assessment.score || 0
    );

    const masteryPoints = this.groupByPeriod(
      sessions,
      period,
      session => session.masteryGain || 0
    );

    return {
      timeSpent: timePoints,
      performance: performancePoints,
      mastery: masteryPoints
    };
  }

  private groupByPeriod(
    data: any[],
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY',
    valueExtractor: (item: any) => number
  ): number[] {
    const periodCount = period === 'DAILY' ? 7 : period === 'WEEKLY' ? 4 : 3;
    const result = new Array(periodCount).fill(0);
    
    data.forEach(item => {
      const index = this.getPeriodIndex(item.startedAt, period, periodCount);
      if (index >= 0) {
        result[index] += valueExtractor(item);
      }
    });

    return result;
  }

  private getPeriodIndex(
    date: Date,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY',
    periodCount: number
  ): number {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const periodLength = period === 'DAILY' 
      ? 24 * 60 * 60 * 1000
      : period === 'WEEKLY'
      ? 7 * 24 * 60 * 60 * 1000
      : 30 * 24 * 60 * 60 * 1000;

    const index = Math.floor(diff / periodLength);
    return index < periodCount ? index : -1;
  }

  private getStartDate(period: 'DAILY' | 'WEEKLY' | 'MONTHLY'): Date {
    const now = new Date();
    switch (period) {
      case 'DAILY':
        return new Date(now.setDate(now.getDate() - 7));
      case 'WEEKLY':
        return new Date(now.setDate(now.getDate() - 28));
      case 'MONTHLY':
        return new Date(now.setMonth(now.getMonth() - 3));
    }
  }

  private identifyStrengths(progress: any[]): string[] {
    return progress
      .filter(p => p.masteryLevel >= 0.8)
      .map(p => p.concept.name);
  }

  private identifyWeaknesses(progress: any[]): string[] {
    return progress
      .filter(p => p.masteryLevel < 0.6)
      .map(p => p.concept.name);
  }

  private async generateRecommendations(
    metrics: LearningMetrics,
    trends: any,
    progress: any[]
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Time-based recommendations
    if (metrics.averageSessionLength < 15) {
      recommendations.push(
        'Try to spend more time on each learning session for better retention'
      );
    }

    // Performance-based recommendations
    if (trends.performance.some(p => p < 0.6)) {
      recommendations.push(
        'Consider reviewing concepts from recent sessions where performance was lower'
      );
    }

    // Mastery-based recommendations
    const lowMasteryConcepts = progress
      .filter(p => p.masteryLevel < 0.6)
      .map(p => p.concept.name);

    if (lowMasteryConcepts.length > 0) {
      recommendations.push(
        `Focus on strengthening your understanding of: ${lowMasteryConcepts.join(', ')}`
      );
    }

    return recommendations;
  }
} 