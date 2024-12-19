import { PrismaClient } from '@prisma/client';

export class ChallengeGenerator {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async generateDailyChallenge(userId: string) {
    const challenge = await this.prisma.challenge.create({
      data: {
        userId,
        title: 'Daily Learning Challenge',
        type: 'daily',
        difficulty: 'medium',
        points: 100,
        requirements: ['Complete one assessment', 'Score above 80%'],
        progress: 0,
        completed: false,
        expiresAt: this.getEndOfDay()
      }
    });

    await this.createChallengeProgress(challenge.id, userId);
    return challenge;
  }

  async generateWeeklyChallenge(userId: string) {
    const challenge = await this.prisma.challenge.create({
      data: {
        userId,
        title: 'Weekly Mastery Challenge',
        type: 'weekly',
        difficulty: 'hard',
        points: 500,
        requirements: ['Complete 5 assessments', 'Average score above 85%'],
        progress: 0,
        completed: false,
        expiresAt: this.getEndOfWeek()
      }
    });

    await this.createChallengeProgress(challenge.id, userId);
    return challenge;
  }

  async updateProgress(challengeId: string, userId: string, progress: number) {
    const challengeProgress = await this.prisma.challengeProgress.update({
      where: {
        challengeId_userId: {
          challengeId,
          userId
        }
      },
      data: {
        progress,
        completed: progress >= 100,
        completedAt: progress >= 100 ? new Date() : null
      }
    });

    if (challengeProgress.completed) {
      await this.awardPoints(challengeId, userId);
    }

    return challengeProgress;
  }

  async getUserChallenges(userId: string) {
    return this.prisma.challenge.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        progress: true
      }
    });
  }

  private async createChallengeProgress(challengeId: string, userId: string) {
    return this.prisma.challengeProgress.create({
      data: {
        challengeId,
        userId,
        progress: 0,
        completed: false
      }
    });
  }

  private async awardPoints(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (challenge) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: challenge.points
          }
        }
      });
    }
  }

  private getEndOfDay(): Date {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  }

  private getEndOfWeek(): Date {
    const date = new Date();
    date.setDate(date.getDate() + (7 - date.getDay()));
    date.setHours(23, 59, 59, 999);
    return date;
  }
} 