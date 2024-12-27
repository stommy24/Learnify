import { LearningProgress } from '@/types/progress';
import { AssessmentResult } from '@/lib/types/assessment';

interface MasteryLevels {
  [objectiveId: string]: number;
}

export class MasteryService {
  private readonly masteryThreshold = 0.85;

  async evaluateAdvancement(userId: string): Promise<boolean> {
    const progress = await this.getProgress(userId);
    return this.calculateMasteryLevel(progress) > this.masteryThreshold;
  }

  private async getProgress(userId: string): Promise<LearningProgress> {
    return {
      id: userId,
      userId,
      timestamp: new Date(),
      results: [],
      adaptations: [],
      assessmentHistory: [],
      objectiveIds: [],
      masteryLevel: {}
    };
  }

  private calculateMasteryLevel(progress: LearningProgress): number {
    if (!progress || !progress.results || progress.results.length === 0) {
      return 0;
    }
    
    const totalScore = progress.results.reduce((sum, result) => sum + result.score, 0);
    const masteryScore = totalScore / progress.results.length;
    
    return masteryScore;
  }

  analyzeLearningGaps(progress: LearningProgress): string[] {
    if (!progress || !progress.results) {
      return [];
    }
    
    const gaps = progress.results
      .filter(result => !result.isCorrect)
      .map(result => result.question.topic);
    
    return gaps;
  }

  updateMasteryStatus(results: AssessmentResult[]): LearningProgress {
    return {
      id: '',
      userId: '',
      timestamp: new Date(),
      results,
      adaptations: [],
      assessmentHistory: [],
      objectiveIds: [],
      masteryLevel: {}
    };
  }

  checkObjectiveMastery(objectiveId: string, progress: LearningProgress): boolean {
    if (!progress || !progress.results) {
      return false;
    }
    
    const objectiveResults = progress.results.filter(r => r.objectiveId === objectiveId);
    const masteryAchieved = this.calculateMasteryLevel({ ...progress, results: objectiveResults }) >= this.masteryThreshold;
    
    return masteryAchieved;
  }
} 