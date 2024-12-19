interface DifficultyMetrics {
  userPerformance: number;
  timeManagement: number;
  consistencyScore: number;
  previousAdjustments: number[];
}

interface AdjustmentResult {
  newDifficulty: number;
  adjustmentReason: string;
  recommendations: string[];
}

export class QuizDifficultyAdjuster {
  private static instance: QuizDifficultyAdjuster;
  private readonly MAX_DIFFICULTY = 5;
  private readonly MIN_DIFFICULTY = 1;
  private readonly ADJUSTMENT_THRESHOLD = 0.15;
  private readonly CONSISTENCY_WEIGHT = 0.3;
  private readonly PERFORMANCE_WEIGHT = 0.5;
  private readonly TIME_WEIGHT = 0.2;

  private constructor() {}

  static getInstance(): QuizDifficultyAdjuster {
    if (!QuizDifficultyAdjuster.instance) {
      QuizDifficultyAdjuster.instance = new QuizDifficultyAdjuster();
    }
    return QuizDifficultyAdjuster.instance;
  }

  async calculateNextDifficulty(
    currentDifficulty: number,
    metrics: DifficultyMetrics
  ): Promise<AdjustmentResult> {
    // Calculate weighted score
    const weightedScore = this.calculateWeightedScore(metrics);
    
    // Determine adjustment direction and magnitude
    const adjustment = this.calculateAdjustment(weightedScore, metrics);
    
    // Apply adjustment with bounds checking
    const newDifficulty = this.boundDifficulty(
      currentDifficulty + adjustment
    );

    // Generate explanation and recommendations
    const result = this.generateAdjustmentResult(
      newDifficulty,
      currentDifficulty,
      metrics
    );

    await this.persistAdjustment(result);
    return result;
  }

  private calculateWeightedScore(metrics: DifficultyMetrics): number {
    return (
      metrics.userPerformance * this.PERFORMANCE_WEIGHT +
      metrics.timeManagement * this.TIME_WEIGHT +
      metrics.consistencyScore * this.CONSISTENCY_WEIGHT
    );
  }

  private calculateAdjustment(
    weightedScore: number,
    metrics: DifficultyMetrics
  ): number {
    const baseAdjustment = weightedScore - 0.7; // 0.7 is the target performance level
    
    // Apply consistency modifier
    const consistencyModifier = metrics.consistencyScore >= 0.8 ? 1 : 0.5;
    
    // Consider previous adjustments to prevent oscillation
    const trendModifier = this.calculateTrendModifier(metrics.previousAdjustments);
    
    return baseAdjustment * consistencyModifier * trendModifier;
  }

  private calculateTrendModifier(previousAdjustments: number[]): number {
    if (previousAdjustments.length < 2) return 1;

    const recentAdjustments = previousAdjustments.slice(-2);
    const oscillating = recentAdjustments[0] * recentAdjustments[1] < 0;
    
    return oscillating ? 0.5 : 1;
  }

  private boundDifficulty(difficulty: number): number {
    return Math.min(
      Math.max(difficulty, this.MIN_DIFFICULTY),
      this.MAX_DIFFICULTY
    );
  }

  private generateAdjustmentResult(
    newDifficulty: number,
    currentDifficulty: number,
    metrics: DifficultyMetrics
  ): AdjustmentResult {
    const difference = newDifficulty - currentDifficulty;
    let reason: string;
    let recommendations: string[] = [];

    if (Math.abs(difference) < this.ADJUSTMENT_THRESHOLD) {
      reason = 'Current difficulty level is appropriate';
      recommendations.push('Continue at the current level');
    } else if (difference > 0) {
      reason = 'Performance indicates readiness for increased difficulty';
      recommendations.push('Focus on maintaining consistency at higher difficulty');
      recommendations.push('Review advanced concepts before proceeding');
    } else {
      reason = 'Adjusting difficulty to improve learning effectiveness';
      recommendations.push('Review fundamental concepts');
      recommendations.push('Practice time management strategies');
    }

    if (metrics.consistencyScore < 0.6) {
      recommendations.push('Work on maintaining consistent performance');
    }

    return {
      newDifficulty,
      adjustmentReason: reason,
      recommendations
    };
  }

  private async persistAdjustment(
    result: AdjustmentResult
  ): Promise<void> {
    // Implement database persistence
  }
}

export const useQuizDifficultyAdjuster = () => {
  const adjuster = QuizDifficultyAdjuster.getInstance();
  return {
    calculateNextDifficulty: adjuster.calculateNextDifficulty.bind(adjuster)
  };
}; 