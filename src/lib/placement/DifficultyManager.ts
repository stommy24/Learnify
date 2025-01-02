import { DIFFICULTY_RULES, DifficultyAdjustment } from '@/types/placement';

export class DifficultyManager {
  private consecutiveCorrect = 0;
  private consecutiveIncorrect = 0;

  async adjustDifficulty({
    currentLevel,
    isCorrect,
    timeSpent
  }: {
    currentLevel: number;
    isCorrect: boolean;
    timeSpent: number;
  }): Promise<DifficultyAdjustment> {
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

    // Handle too slow responses
    if (timeSpent > DIFFICULTY_RULES.TIME_LIMITS.TOO_SLOW) {
      adjustment = this.decreaseDifficulty(currentLevel, 'Time threshold exceeded');
    }
    // Handle consecutive correct answers
    else if (this.consecutiveCorrect >= DIFFICULTY_RULES.INCREASE_THRESHOLD) {
      adjustment = this.increaseDifficulty(currentLevel, 'Consecutive correct answers');
    }
    // Handle consecutive incorrect answers
    else if (this.consecutiveIncorrect >= DIFFICULTY_RULES.DECREASE_THRESHOLD) {
      adjustment = this.decreaseDifficulty(currentLevel, 'Consecutive incorrect answers');
    }

    return adjustment;
  }

  private increaseDifficulty(currentLevel: number, reason: string): DifficultyAdjustment {
    return {
      newLevel: Math.min(10, currentLevel + 1),
      reason,
      confidenceScore: 0.8
    };
  }

  private decreaseDifficulty(currentLevel: number, reason: string): DifficultyAdjustment {
    return {
      newLevel: Math.max(1, currentLevel - 1),
      reason,
      confidenceScore: 0.3
    };
  }
} 