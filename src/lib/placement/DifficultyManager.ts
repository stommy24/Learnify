import { DIFFICULTY_RULES, DifficultyAdjustment } from '@/types/placement';
import { MasteryTracker } from '@/lib/mastery/MasteryTracker';

export class DifficultyManager {
  private consecutiveCorrect = 0;
  private consecutiveIncorrect = 0;
  private masteryTracker: MasteryTracker;

  constructor(masteryTracker = new MasteryTracker()) {
    this.masteryTracker = masteryTracker;
  }

  async adjustDifficulty({
    currentLevel,
    isCorrect,
    timeSpent,
    studentId,
    conceptId
  }: {
    currentLevel: number;
    isCorrect: boolean;
    timeSpent: number;
    studentId: string;
    conceptId: string;
  }): Promise<DifficultyAdjustment> {
    // Update mastery tracking
    await this.masteryTracker.updateMasteryProgress(studentId, conceptId, {
      correct: isCorrect,
      timeSpent,
      difficulty: currentLevel
    });

    // Existing consecutive tracking
    if (isCorrect) {
      this.consecutiveCorrect++;
      this.consecutiveIncorrect = 0;
    } else {
      this.consecutiveCorrect = 0;
      this.consecutiveIncorrect++;
    }

    let adjustment: DifficultyAdjustment = {
      newLevel: currentLevel,
      reason: 'No change needed',
      confidenceScore: 0.5
    };

    // Enhanced difficulty adjustment logic
    if (timeSpent > DIFFICULTY_RULES.TIME_LIMITS.TOO_SLOW) {
      adjustment = this.decreaseDifficulty(currentLevel, 'Time threshold exceeded', 0.3);
    } 
    else if (this.consecutiveCorrect >= DIFFICULTY_RULES.INCREASE_THRESHOLD) {
      const masteryMetrics = await this.masteryTracker.getMasteryMetrics(studentId, conceptId);
      
      // Only increase difficulty if showing mastery
      if (masteryMetrics.consistency >= 0.85) {
        adjustment = this.increaseDifficulty(
          currentLevel, 
          'Consistent performance and consecutive correct answers',
          Math.min(0.9, masteryMetrics.consistency)
        );
      }
    } 
    else if (this.consecutiveIncorrect >= DIFFICULTY_RULES.DECREASE_THRESHOLD) {
      adjustment = this.decreaseDifficulty(
        currentLevel, 
        'Consecutive incorrect answers',
        0.3
      );
    }

    return adjustment;
  }

  private increaseDifficulty(
    currentLevel: number, 
    reason: string,
    confidence: number
  ): DifficultyAdjustment {
    return {
      newLevel: Math.min(10, currentLevel + 1),
      reason,
      confidenceScore: confidence
    };
  }

  private decreaseDifficulty(
    currentLevel: number, 
    reason: string,
    confidence: number
  ): DifficultyAdjustment {
    return {
      newLevel: Math.max(1, currentLevel - 1),
      reason,
      confidenceScore: confidence
    };
  }
} 