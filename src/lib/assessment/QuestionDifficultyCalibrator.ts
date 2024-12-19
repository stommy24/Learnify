interface CalibrationData {
  questionId: string;
  attempts: number;
  successRate: number;
  averageTime: number;
  userRatings: number[];
  discriminationIndex: number;
  difficultyLevel: number;
}

interface CalibrationResult {
  adjustedDifficulty: number;
  confidence: number;
  metrics: {
    timeImpact: number;
    successImpact: number;
    ratingImpact: number;
    discriminationImpact: number;
  };
}

export class QuestionDifficultyCalibrator {
  private static instance: QuestionDifficultyCalibrator;
  private calibrationData: Map<string, CalibrationData> = new Map();
  private readonly MIN_ATTEMPTS = 10;
  private readonly CONFIDENCE_THRESHOLD = 0.7;

  private constructor() {}

  static getInstance(): QuestionDifficultyCalibrator {
    if (!QuestionDifficultyCalibrator.instance) {
      QuestionDifficultyCalibrator.instance = new QuestionDifficultyCalibrator();
    }
    return QuestionDifficultyCalibrator.instance;
  }

  async calibrateQuestion(
    questionId: string,
    newAttempt?: {
      success: boolean;
      time: number;
      userRating?: number;
    }
  ): Promise<CalibrationResult> {
    let data = this.calibrationData.get(questionId);
    
    if (newAttempt) {
      data = await this.updateCalibrationData(questionId, newAttempt, data);
    }

    if (!data || data.attempts < this.MIN_ATTEMPTS) {
      return {
        adjustedDifficulty: data?.difficultyLevel || 3,
        confidence: data ? data.attempts / this.MIN_ATTEMPTS : 0,
        metrics: { timeImpact: 0, successImpact: 0, ratingImpact: 0, discriminationImpact: 0 }
      };
    }

    const result = this.calculateDifficulty(data);
    await this.persistCalibration(questionId, result);
    return result;
  }

  private async updateCalibrationData(
    questionId: string,
    attempt: { success: boolean; time: number; userRating?: number },
    existingData?: CalibrationData
  ): Promise<CalibrationData> {
    const data = existingData || {
      questionId,
      attempts: 0,
      successRate: 0,
      averageTime: 0,
      userRatings: [],
      discriminationIndex: 0,
      difficultyLevel: 3
    };

    // Update attempts and success rate
    data.attempts++;
    data.successRate = (
      (data.successRate * (data.attempts - 1) + (attempt.success ? 1 : 0)) /
      data.attempts
    );

    // Update average time
    data.averageTime = (
      (data.averageTime * (data.attempts - 1) + attempt.time) /
      data.attempts
    );

    // Add user rating if provided
    if (attempt.userRating) {
      data.userRatings.push(attempt.userRating);
    }

    // Update discrimination index periodically
    if (data.attempts % 10 === 0) {
      data.discriminationIndex = await this.calculateDiscriminationIndex(questionId);
    }

    this.calibrationData.set(questionId, data);
    return data;
  }

  private calculateDifficulty(data: CalibrationData): CalibrationResult {
    // Calculate individual metric impacts
    const timeImpact = this.calculateTimeImpact(data.averageTime);
    const successImpact = this.calculateSuccessImpact(data.successRate);
    const ratingImpact = this.calculateRatingImpact(data.userRatings);
    const discriminationImpact = data.discriminationIndex;

    // Weight the different factors
    const weights = {
      time: 0.25,
      success: 0.35,
      rating: 0.2,
      discrimination: 0.2
    };

    const adjustedDifficulty = (
      timeImpact * weights.time +
      successImpact * weights.success +
      ratingImpact * weights.rating +
      discriminationImpact * weights.discrimination
    );

    // Calculate confidence based on number of attempts and consistency
    const confidence = Math.min(
      1,
      (data.attempts / this.MIN_ATTEMPTS) *
      this.calculateConsistency(data)
    );

    return {
      adjustedDifficulty: Math.round(adjustedDifficulty * 2) / 2, // Round to nearest 0.5
      confidence,
      metrics: {
        timeImpact,
        successImpact,
        ratingImpact,
        discriminationImpact
      }
    };
  }

  private calculateTimeImpact(averageTime: number): number {
    // Implement time-based difficulty calculation
    return Math.min(5, Math.max(1, averageTime / 30));
  }

  private calculateSuccessImpact(successRate: number): number {
    // Convert success rate to difficulty (inverse relationship)
    return 5 - (successRate * 4);
  }

  private calculateRatingImpact(ratings: number[]): number {
    if (ratings.length === 0) return 3;
    return ratings.reduce((a, b) => a + b) / ratings.length;
  }

  private calculateConsistency(data: CalibrationData): number {
    // Implement consistency calculation
    return 0.8; // Placeholder
  }

  private async calculateDiscriminationIndex(
    questionId: string
  ): Promise<number> {
    // Implement discrimination index calculation
    return 0.5; // Placeholder
  }

  private async persistCalibration(
    questionId: string,
    result: CalibrationResult
  ): Promise<void> {
    // Implement database persistence
  }
}

export const useQuestionCalibrator = () => {
  const calibrator = QuestionDifficultyCalibrator.getInstance();
  return {
    calibrateQuestion: calibrator.calibrateQuestion.bind(calibrator)
  };
}; 