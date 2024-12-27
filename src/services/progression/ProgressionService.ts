import { AssessmentResult } from '@/lib/types/assessment';
import { LearningProgress } from '@/types/progress';
import { prisma } from '@/lib/prisma';

export class ProgressionService {
  async updateProgress(
    userId: string,
    results: AssessmentResult[],
    timestamp: Date,
    topicId: string
  ): Promise<LearningProgress> {
    const existingProgress = await this.getCurrentProgress(userId, topicId);
    
    const updatedProgress: LearningProgress = {
      ...existingProgress,
      timestamp,
      results: [...existingProgress.results, ...results],
      assessmentHistory: [...existingProgress.assessmentHistory, ...results],
      objectiveIds: Array.from(new Set([
        ...existingProgress.objectiveIds,
        ...results.map(r => r.objectiveId).filter((id): id is string => id !== undefined)
      ])),
      masteryLevel: this.calculateMasteryLevels(results, existingProgress.masteryLevel)
    };

    await this.saveProgress(updatedProgress);
    return updatedProgress;
  }

  private calculateMasteryLevels(
    results: AssessmentResult[],
    existingLevels: { [key: string]: number }
  ): { [key: string]: number } {
    const levels = { ...existingLevels };
    
    results.forEach(result => {
      if (!result.objectiveId) return;
      
      const currentLevel = levels[result.objectiveId] || 0;
      levels[result.objectiveId] = Math.min(100, currentLevel + result.score);
    });

    return levels;
  }

  async getCurrentProgress(userId: string, topicId: string): Promise<LearningProgress> {
    const progress = await prisma.learningProgress.findFirst({
      where: { userId, topicId }
    });

    if (!progress) {
      return {
        id: crypto.randomUUID(),
        userId,
        timestamp: new Date(),
        results: [],
        adaptations: [],
        assessmentHistory: [],
        objectiveIds: [],
        masteryLevel: {}
      };
    }

    return progress as LearningProgress;
  }

  private async saveProgress(progress: LearningProgress): Promise<void> {
    await prisma.learningProgress.upsert({
      where: { id: progress.id },
      update: progress,
      create: progress
    });
  }

  async getAllProgress(): Promise<{ [objectiveId: string]: number }> {
    // This method is used in tests - returns masteryLevel directly
    const progress = await prisma.learningProgress.findFirst();
    return progress?.masteryLevel ?? {};
  }
} 