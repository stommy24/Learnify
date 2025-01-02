import { prisma } from '@/lib/db';
import { Achievement } from '@/types/dashboard';
import { logger } from '@/lib/monitoring';

interface AchievementRule {
  id: string;
  type: Achievement['type'];
  title: string;
  description: string;
  condition: (metrics: any) => boolean;
  icon: string;
}

export class AchievementService {
  private rules: AchievementRule[] = [
    {
      id: 'first-perfect-score',
      type: 'MASTERY',
      title: 'Perfect Score!',
      description: 'Achieve 100% on your first attempt',
      icon: 'trophy',
      condition: (metrics) => metrics.accuracy === 1 && metrics.attempts === 1
    },
    {
      id: 'speed-demon',
      type: 'SPEED',
      title: 'Speed Demon',
      description: 'Complete exercises in record time',
      icon: 'clock',
      condition: (metrics) => metrics.averageSpeed < 30 && metrics.accuracy > 0.9
    },
    {
      id: 'weekly-streak',
      type: 'STREAK',
      title: 'Weekly Warrior',
      description: 'Practice every day for a week',
      icon: 'star',
      condition: (metrics) => metrics.streak >= 7
    },
    // Add more achievement rules
  ];

  async checkAchievements(userId: string): Promise<Achievement[]> {
    try {
      const metrics = await this.getUserMetrics(userId);
      const newAchievements: Achievement[] = [];

      for (const rule of this.rules) {
        const existing = await prisma.achievement.findFirst({
          where: {
            userId,
            type: rule.type,
            title: rule.title
          }
        });

        if (!existing && rule.condition(metrics)) {
          const achievement = await prisma.achievement.create({
            data: {
              userId,
              type: rule.type,
              title: rule.title,
              description: rule.description,
              icon: rule.icon,
              earnedAt: new Date()
            }
          });
          newAchievements.push(achievement);
        }
      }

      return newAchievements;
    } catch (error) {
      logger.error('Failed to check achievements', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async getUserMetrics(userId: string) {
    // Fetch user metrics from various services
    const [progress, performance, streak] = await Promise.all([
      this.getProgressMetrics(userId),
      this.getPerformanceMetrics(userId),
      this.getStreakMetrics(userId)
    ]);

    return {
      ...progress,
      ...performance,
      ...streak
    };
  }

  private async getProgressMetrics(userId: string) {
    // Implementation
    return { /* metrics */ };
  }

  private async getPerformanceMetrics(userId: string) {
    // Implementation
    return { /* metrics */ };
  }

  private async getStreakMetrics(userId: string) {
    // Implementation
    return { /* metrics */ };
  }
} 