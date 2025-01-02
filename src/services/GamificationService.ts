import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  criteria: {
    type: 'STREAK' | 'COMPLETION' | 'MASTERY' | 'SPEED';
    threshold: number;
    subject?: string;
  };
}

interface ProgressUpdate {
  userId: string;
  type: 'LESSON' | 'PRACTICE' | 'ASSESSMENT';
  subject: string;
  score?: number;
  timeSpent: number;
  completedAt: Date;
}

export class GamificationService {
  private readonly DAILY_GOAL = 20; // minutes
  private readonly STREAK_THRESHOLD = 5; // minutes

  async updateProgress(data: ProgressUpdate): Promise<void> {
    try {
      const [
        dailyProgress,
        achievements
      ] = await Promise.all([
        this.updateDailyProgress(data),
        this.checkAchievements(data)
      ]);

      if (dailyProgress.isGoalMet) {
        await this.updateStreak(data.userId);
      }

      if (achievements.length > 0) {
        await this.awardAchievements(data.userId, achievements);
      }

      await this.updatePoints(data);
    } catch (error) {
      logger.error('Failed to update gamification progress', {
        userId: data.userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async updateDailyProgress(
    data: ProgressUpdate
  ): Promise<{ isGoalMet: boolean }> {
    const today = new Date().toISOString().split('T')[0];
    
    const progress = await prisma.dailyProgress.upsert({
      where: {
        userId_date: {
          userId: data.userId,
          date: today
        }
      },
      update: {
        timeSpent: { increment: data.timeSpent },
        activitiesCompleted: { increment: 1 }
      },
      create: {
        userId: data.userId,
        date: today,
        timeSpent: data.timeSpent,
        activitiesCompleted: 1
      }
    });

    return { isGoalMet: progress.timeSpent >= this.DAILY_GOAL };
  }

  private async updateStreak(userId: string): Promise<void> {
    const streak = await prisma.learningStreak.upsert({
      where: { userId },
      update: {
        currentStreak: { increment: 1 },
        lastActivityDate: new Date()
      },
      create: {
        userId,
        currentStreak: 1,
        lastActivityDate: new Date()
      }
    });

    if (streak.currentStreak > streak.longestStreak) {
      await prisma.learningStreak.update({
        where: { userId },
        data: { longestStreak: streak.currentStreak }
      });
    }
  }

  private async checkAchievements(
    data: ProgressUpdate
  ): Promise<Achievement[]> {
    const achievements: Achievement[] = [];
    
    // Check completion achievements
    if (data.type === 'ASSESSMENT' && data.score && data.score > 0.9) {
      achievements.push({
        id: 'mastery-achievement',
        title: 'Mastery Achieved',
        description: 'Score over 90% on an assessment',
        icon: '🏆',
        points: 100,
        criteria: {
          type: 'MASTERY',
          threshold: 0.9
        }
      });
    }

    // Add more achievement checks here

    return achievements;
  }

  private async awardAchievements(
    userId: string,
    achievements: Achievement[]
  ): Promise<void> {
    const points = achievements.reduce((sum, a) => sum + a.points, 0);

    await prisma.$transaction([
      prisma.userAchievement.createMany({
        data: achievements.map(a => ({
          userId,
          achievementId: a.id,
          awardedAt: new Date()
        }))
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          points: { increment: points }
        }
      })
    ]);
  }

  private async updatePoints(data: ProgressUpdate): Promise<void> {
    let points = Math.floor(data.timeSpent / 5); // Base points

    if (data.score) {
      points += Math.floor(data.score * 100); // Points for performance
    }

    await prisma.user.update({
      where: { id: data.userId },
      data: {
        points: { increment: points }
      }
    });
  }
} 