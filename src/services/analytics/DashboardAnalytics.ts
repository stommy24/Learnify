import { prisma } from '@/lib/prisma';
import { 
  AnalyticsData, 
  PerformanceMetrics,
  EngagementMetrics,
  LearningProgress
} from '@/types/analytics';

export class DashboardAnalytics {
  async generateStudentAnalytics(studentId: string): Promise<AnalyticsData> {
    const [
      performance,
      engagement,
      progress
    ] = await Promise.all([
      this.getPerformanceMetrics(studentId),
      this.getEngagementMetrics(studentId),
      this.getLearningProgress(studentId)
    ]);

    return {
      performance,
      engagement,
      progress,
      timestamp: new Date().toISOString()
    };
  }

  private async getPerformanceMetrics(
    studentId: string
  ): Promise<PerformanceMetrics> {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const results = await prisma.practiceResult.findMany({
      where: {
        studentId,
        completedAt: {
          gte: last30Days
        }
      },
      include: {
        practice: {
          include: {
            subject: true,
            topic: true
          }
        }
      }
    });

    return {
      overall: this.calculateOverallScore(results),
      bySubject: this.aggregateBySubject(results),
      improvement: this.calculateImprovement(results),
      strengths: this.identifyStrengths(results),
      weaknesses: this.identifyWeaknesses(results)
    };
  }

  private async getEngagementMetrics(
    studentId: string
  ): Promise<EngagementMetrics> {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const sessions = await prisma.practiceSession.findMany({
      where: {
        studentId,
        startedAt: {
          gte: last7Days
        }
      }
    });

    return {
      practiceFrequency: this.calculatePracticeFrequency(sessions),
      averageSessionDuration: this.calculateAverageSessionDuration(sessions),
      completionRate: this.calculateCompletionRate(sessions),
      streakData: await this.getStreakData(studentId)
    };
  }

  private async getLearningProgress(
    studentId: string
  ): Promise<LearningProgress> {
    const topics = await prisma.topicProgress.findMany({
      where: { studentId },
      include: {
        topic: true,
        recentAssessments: true
      }
    });

    return {
      mastery: this.calculateMasteryLevels(topics),
      progression: this.trackProgression(topics),
      nextSteps: this.generateNextSteps(topics),
      recommendations: this.generateRecommendations(topics)
    };
  }

  private calculateOverallScore(results: any[]): number {
    if (results.length === 0) return 0;
    return results.reduce((acc, r) => acc + r.score, 0) / results.length;
  }

  private aggregateBySubject(results: any[]): Record<string, number> {
    const bySubject: Record<string, number[]> = {};
    
    results.forEach(result => {
      const subject = result.practice.subject.name;
      if (!bySubject[subject]) bySubject[subject] = [];
      bySubject[subject].push(result.score);
    });

    return Object.entries(bySubject).reduce((acc, [subject, scores]) => ({
      ...acc,
      [subject]: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }), {});
  }

  private calculateImprovement(results: any[]): number {
    if (results.length < 2) return 0;
    
    const sortedResults = [...results].sort(
      (a, b) => a.completedAt.getTime() - b.completedAt.getTime()
    );

    const firstWeek = sortedResults.slice(0, 7);
    const lastWeek = sortedResults.slice(-7);

    const firstWeekAvg = this.calculateOverallScore(firstWeek);
    const lastWeekAvg = this.calculateOverallScore(lastWeek);

    return ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;
  }

  private identifyStrengths(results: any[]): string[] {
    const topicScores: Record<string, number[]> = {};
    
    results.forEach(result => {
      const topic = result.practice.topic.name;
      if (!topicScores[topic]) topicScores[topic] = [];
      topicScores[topic].push(result.score);
    });

    return Object.entries(topicScores)
      .map(([topic, scores]) => ({
        topic,
        average: scores.reduce((a, b) => a + b, 0) / scores.length
      }))
      .filter(({ average }) => average >= 80)
      .map(({ topic }) => topic);
  }

  private identifyWeaknesses(results: any[]): string[] {
    // Similar to strengths but looking for scores below 60%
    return [];
  }

  private calculatePracticeFrequency(sessions: any[]): number {
    // Calculate average sessions per day
    return 0;
  }

  private calculateAverageSessionDuration(sessions: any[]): number {
    // Calculate average duration in minutes
    return 0;
  }

  private calculateCompletionRate(sessions: any[]): number {
    // Calculate percentage of completed sessions
    return 0;
  }

  private async getStreakData(studentId: string): Promise<{
    current: number;
    longest: number;
    history: number[];
  }> {
    // Implement streak calculation logic
    return {
      current: 0,
      longest: 0,
      history: []
    };
  }
} 