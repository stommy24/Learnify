import { prisma } from '@/lib/db';
import { DashboardMetrics, Achievement } from '@/types/dashboard';

export class DashboardService {
  async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    try {
      const [
        progress,
        performance,
        currentTopic,
        achievements
      ] = await Promise.all([
        this.getProgressMetrics(userId),
        this.getPerformanceMetrics(userId),
        this.getCurrentTopic(userId),
        this.getAchievements(userId)
      ]);

      return {
        progress,
        performance,
        currentTopic,
        achievements
      };
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      throw error;
    }
  }

  private async getProgressMetrics(userId: string) {
    const progress = await prisma.userProgress.findUnique({
      where: { userId },
      include: {
        completedTopics: true,
        _count: {
          select: { completedTopics: true }
        }
      }
    });

    const totalTopics = await prisma.topic.count();

    return {
      currentLevel: progress?.currentLevel ?? 1,
      completedTopics: progress?._count.completedTopics ?? 0,
      totalTopics,
      masteryPercentage: Math.round(
        ((progress?._count.completedTopics ?? 0) / totalTopics) * 100
      )
    };
  }

  private async getPerformanceMetrics(userId: string) {
    const recent = await prisma.questionAnswer.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    const streak = await this.calculateStreak(userId);

    return {
      accuracy: this.calculateAccuracy(recent),
      averageSpeed: this.calculateAverageSpeed(recent),
      streak,
      lastActive: recent[0]?.createdAt ?? new Date()
    };
  }

  private async getCurrentTopic(userId: string) {
    const currentTopic = await prisma.userProgress.findUnique({
      where: { userId },
      include: {
        currentTopic: true,
        topicProgress: {
          where: {
            topicId: { equals: prisma.userProgress.fields.currentTopicId }
          }
        }
      }
    });

    return {
      id: currentTopic?.currentTopic?.id ?? '',
      name: currentTopic?.currentTopic?.name ?? 'Getting Started',
      progress: currentTopic?.topicProgress[0]?.progress ?? 0,
      nextMilestone: currentTopic?.topicProgress[0]?.nextMilestone ?? 'Complete first lesson'
    };
  }

  private async getAchievements(userId: string) {
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
      take: 5
    });

    const total = await prisma.achievement.count({
      where: { userId }
    });

    return {
      recent: achievements,
      total
    };
  }

  private calculateAccuracy(answers: any[]): number {
    if (answers.length === 0) return 0;
    return answers.filter(a => a.correct).length / answers.length;
  }

  private calculateAverageSpeed(answers: any[]): number {
    if (answers.length === 0) return 0;
    return answers.reduce((acc, curr) => acc + curr.timeSpent, 0) / answers.length;
  }

  private async calculateStreak(userId: string): Promise<number> {
    // Implement streak calculation logic
    return 0;
  }
} 