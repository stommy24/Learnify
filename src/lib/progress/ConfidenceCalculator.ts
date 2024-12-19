interface AnswerMetrics {
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
  answerChanges: number;
  attemptNumber: number;
  responseTime: number; // in seconds
}

export class ConfidenceCalculator {
  private static instance: ConfidenceCalculator;
  
  // Baseline metrics for comparison
  private readonly EXPECTED_TIMES = {
    maths: {
      1: 60, // seconds for Year 1
      2: 90,
      3: 120,
      4: 150,
      5: 180,
      6: 210
    },
    english: {
      1: 90,
      2: 120,
      3: 150,
      4: 180,
      5: 210,
      6: 240
    }
  };

  static getInstance(): ConfidenceCalculator {
    if (!ConfidenceCalculator.instance) {
      ConfidenceCalculator.instance = new ConfidenceCalculator();
    }
    return ConfidenceCalculator.instance;
  }

  calculateConfidence(
    answers: AnswerMetrics[],
    subject: 'maths' | 'english',
    yearGroup: number
  ): number {
    const weights = {
      accuracy: 0.4,
      speed: 0.2,
      consistency: 0.2,
      independence: 0.2
    };

    const accuracyScore = this.calculateAccuracyScore(answers);
    const speedScore = this.calculateSpeedScore(answers, subject, yearGroup);
    const consistencyScore = this.calculateConsistencyScore(answers);
    const independenceScore = this.calculateIndependenceScore(answers);

    return (
      accuracyScore * weights.accuracy +
      speedScore * weights.speed +
      consistencyScore * weights.consistency +
      independenceScore * weights.independence
    );
  }

  private calculateAccuracyScore(answers: AnswerMetrics[]): number {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    return correctAnswers / answers.length;
  }

  private calculateSpeedScore(
    answers: AnswerMetrics[],
    subject: 'maths' | 'english',
    yearGroup: number
  ): number {
    const expectedTime = this.EXPECTED_TIMES[subject][yearGroup];
    
    return answers.reduce((score, answer) => {
      const timeRatio = answer.timeSpent / expectedTime;
      // Score higher for faster correct answers, lower for rushed incorrect ones
      const timeScore = answer.isCorrect ? 
        Math.min(1, 1.2 - timeRatio) : 
        Math.max(0, timeRatio - 0.5);
      return score + timeScore;
    }, 0) / answers.length;
  }

  private calculateConsistencyScore(answers: AnswerMetrics[]): number {
    if (answers.length < 2) return 1;

    // Check for patterns in performance
    const performancePattern = answers.map(a => a.isCorrect);
    let consistencyScore = 1;

    // Penalize for alternating correct/incorrect answers
    for (let i = 1; i < performancePattern.length; i++) {
      if (performancePattern[i] !== performancePattern[i - 1]) {
        consistencyScore -= 0.1;
      }
    }

    // Penalize for multiple answer changes
    const changesPenalty = answers.reduce((penalty, answer) => 
      penalty + (answer.answerChanges * 0.05), 0
    );

    return Math.max(0, consistencyScore - changesPenalty);
  }

  private calculateIndependenceScore(answers: AnswerMetrics[]): number {
    return answers.reduce((score, answer) => {
      const hintPenalty = answer.hintsUsed * 0.15;
      return score + Math.max(0, 1 - hintPenalty);
    }, 0) / answers.length;
  }
} 