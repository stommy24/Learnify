interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'mastery' | 'engagement' | 'special';
  criteria: {
    type: 'progress' | 'streak' | 'completion' | 'mastery';
    threshold: number;
    subject?: string;
    topic?: string;
  };
  reward?: {
    type: 'badge' | 'points' | 'unlock';
    value: any;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export class AchievementSystem {
  private static instance: AchievementSystem;
  private achievements: Achievement[] = [];
  private userAchievements: Map<string, Set<string>> = new Map();

  private constructor() {
    this.initializeAchievements();
  }

  static getInstance(): AchievementSystem {
    if (!AchievementSystem.instance) {
      AchievementSystem.instance = new AchievementSystem();
    }
    return AchievementSystem.instance;
  }

  private initializeAchievements() {
    // Initialize built-in achievements
    this.achievements = [
      {
        id: 'first-steps',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        category: 'progress',
        criteria: {
          type: 'completion',
          threshold: 1
        },
        rarity: 'common'
      },
      {
        id: 'consistent-learner',
        title: 'Consistent Learner',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'engagement',
        criteria: {
          type: 'streak',
          threshold: 7
        },
        rarity: 'rare'
      },
      // Add more achievements as needed
    ];
  }

  async checkAchievements(userId: string, action: {
    type: string;
    value: number;
    metadata?: any;
  }): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = [];
    const userProgress = await this.getUserProgress(userId);

    for (const achievement of this.achievements) {
      if (this.hasAchievement(userId, achievement.id)) continue;

      if (this.checkCriteria(achievement.criteria, action, userProgress)) {
        await this.unlockAchievement(userId, achievement);
        unlockedAchievements.push(achievement);
      }
    }

    return unlockedAchievements;
  }

  private async getUserProgress(userId: string): Promise<any> {
    // Fetch user progress from database
    return {};
  }

  private hasAchievement(userId: string, achievementId: string): boolean {
    return this.userAchievements.get(userId)?.has(achievementId) ?? false;
  }

  private checkCriteria(
    criteria: Achievement['criteria'],
    action: { type: string; value: number; metadata?: any },
    userProgress: any
  ): boolean {
    switch (criteria.type) {
      case 'progress':
        return action.value >= criteria.threshold;
      case 'streak':
        return userProgress.streak >= criteria.threshold;
      case 'completion':
        return userProgress.completedItems >= criteria.threshold;
      case 'mastery':
        return userProgress.mastery?.[criteria.subject!] >= criteria.threshold;
      default:
        return false;
    }
  }

  private async unlockAchievement(
    userId: string,
    achievement: Achievement
  ): Promise<void> {
    if (!this.userAchievements.has(userId)) {
      this.userAchievements.set(userId, new Set());
    }
    this.userAchievements.get(userId)!.add(achievement.id);

    // Persist to database and grant rewards
    if (achievement.reward) {
      await this.grantReward(userId, achievement.reward);
    }
  }

  private async grantReward(
    userId: string,
    reward: Achievement['reward']
  ): Promise<void> {
    // Implement reward granting logic
  }
}

export const useAchievements = () => {
  const achievementSystem = AchievementSystem.getInstance();
  return {
    checkAchievements: achievementSystem.checkAchievements.bind(achievementSystem)
  };
}; 