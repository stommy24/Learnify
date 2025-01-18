import { prisma } from '@/lib/prisma';
import { Prisma, Achievement as PrismaAchievement, UserAchievement } from '@prisma/client';
import type { DashboardMetrics, Achievement } from '@/types/dashboard';

export class DashboardService {
  async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    const [
      recentAchievements,
      totalAchievements,
      progressStats,
      recentAnswers,
      learningStreak
    ] = await Promise.all([
      this.getRecentAchievements(userId),
      this.getTotalAchievements(userId),
      this.calculateProgress(userId),
      this.getRecentAnswers(userId),
      this.getLearningStreak(userId)
    ]);

    return {
      achievements: {
        recent: recentAchievements,
        total: totalAchievements
      },
      progress: progressStats,
      recentAnswers,
      streak: learningStreak
    };
  }

  private async getRecentAchievements(userId: string): Promise<Achievement[]> {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: {
        unlockedAt: 'desc'
      },
      take: 5
    });

    return userAchievements.map(ua => ({
      id: ua.achievement.id,
      title: ua.achievement.name,
      description: ua.achievement.description,
      icon: 'trophy',
      type: ua.achievement.type,
      xpReward: ua.achievement.xpReward,
      earnedAt: ua.unlockedAt
    }));
  }

  private async calculateProgress(userId: string) {
    const topics = await prisma.topic.count();
    const completedProgress = await prisma.progress.count({
      where: {
        userId,
        currentLevel: {
          gte: 100
        }
      }
    });

    const averageProgress = await prisma.progress.aggregate({
      where: { userId },
      _avg: {
        currentLevel: true
      }
    });

    return {
      currentLevel: Math.floor(averageProgress._avg.currentLevel || 0),
      completedTopics: completedProgress,
      totalTopics: topics,
      masteryPercentage: topics > 0 ? (completedProgress / topics) * 100 : 0
    };
  }

  private async getProgressStats(userId: string) {
    const progress = await prisma.progress.findMany({
      where: {
        userId
      }
    });

    return {
      completed: progress.filter(p => p.currentLevel >= 100).length,
      inProgress: progress.filter(p => p.currentLevel > 0 && p.currentLevel < 100).length,
      total: progress.length
    };
  }

  private async getRecentAnswers(userId: string) {
    const answers = await prisma.questionAnswer.findMany({
      where: {
        studentId: userId  // Changed from userId to studentId based on your schema
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    return answers;
  }

  private async getLearningStreak(userId: string) {
    const progress = await prisma.progress.findMany({
      where: {
        userId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Your streak calculation logic here
    return {
      current: 0,
      longest: 0
    };
  }

  private async getWeeklyProgress(userId: string) {
    const progress = await prisma.progress.findMany({
      where: {
        userId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return progress;
  }

  private async getTotalAchievements(userId: string) {
    const count = await prisma.userAchievement.count({
      where: {
        userId
      }
    });

    return count;
  }
}