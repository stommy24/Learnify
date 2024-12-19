interface PathProgress {
  nodeId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  attempts: number;
  score?: number;
  timeSpent: number;
}

interface PathStats {
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  averageScore: number;
  totalTimeSpent: number;
  estimatedTimeRemaining: number;
}

export class LearningPathProgress {
  private static instance: LearningPathProgress;
  private progress: Map<string, Map<string, PathProgress>> = new Map(); // userId -> (nodeId -> progress)

  private constructor() {}

  static getInstance(): LearningPathProgress {
    if (!LearningPathProgress.instance) {
      LearningPathProgress.instance = new LearningPathProgress();
    }
    return LearningPathProgress.instance;
  }

  async trackProgress(
    userId: string,
    pathId: string,
    nodeId: string,
    update: Partial<PathProgress>
  ): Promise<void> {
    const userProgress = this.progress.get(userId) || new Map();
    const currentProgress = userProgress.get(nodeId) || {
      nodeId,
      status: 'not-started',
      attempts: 0,
      timeSpent: 0
    };

    const updatedProgress = {
      ...currentProgress,
      ...update,
      attempts: update.status === 'completed' 
        ? currentProgress.attempts + 1 
        : currentProgress.attempts
    };

    userProgress.set(nodeId, updatedProgress);
    this.progress.set(userId, userProgress);

    // Persist to database
    await this.saveProgress(userId, pathId, updatedProgress);
  }

  async getPathStats(userId: string, pathId: string): Promise<PathStats> {
    const userProgress = this.progress.get(userId);
    if (!userProgress) {
      return {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        estimatedTimeRemaining: 0
      };
    }

    const stats = Array.from(userProgress.values()).reduce(
      (acc, progress) => ({
        totalNodes: acc.totalNodes + 1,
        completedNodes: progress.status === 'completed' 
          ? acc.completedNodes + 1 
          : acc.completedNodes,
        inProgressNodes: progress.status === 'in-progress'
          ? acc.inProgressNodes + 1
          : acc.inProgressNodes,
        totalScore: progress.score 
          ? acc.totalScore + progress.score 
          : acc.totalScore,
        scoredNodes: progress.score ? acc.scoredNodes + 1 : acc.scoredNodes,
        totalTimeSpent: acc.totalTimeSpent + progress.timeSpent
      }),
      {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        totalScore: 0,
        scoredNodes: 0,
        totalTimeSpent: 0
      }
    );

    return {
      ...stats,
      averageScore: stats.scoredNodes > 0 
        ? stats.totalScore / stats.scoredNodes 
        : 0,
      estimatedTimeRemaining: await this.calculateEstimatedTimeRemaining(
        userId,
        pathId
      )
    };
  }

  private async saveProgress(
    userId: string,
    pathId: string,
    progress: PathProgress
  ): Promise<void> {
    // Implement database persistence
  }

  private async calculateEstimatedTimeRemaining(
    userId: string,
    pathId: string
  ): Promise<number> {
    // Implement time estimation logic
    return 0;
  }
}

export const useLearningPathProgress = () => {
  const progressTracker = LearningPathProgress.getInstance();
  return {
    trackProgress: progressTracker.trackProgress.bind(progressTracker),
    getPathStats: progressTracker.getPathStats.bind(progressTracker)
  };
}; 