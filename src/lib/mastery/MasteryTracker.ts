import { prisma } from '@/lib/db';
import { logger } from '@/lib/monitoring';

interface MasteryMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  repetitions: number;
}

interface MasteryThresholds {
  accuracyThreshold: number;
  speedThreshold: number;
  consistencyThreshold: number;
  requiredRepetitions: number;
}

export class MasteryTracker {
  private static DEFAULT_THRESHOLDS: MasteryThresholds = {
    accuracyThreshold: 0.9,    // 90% correct
    speedThreshold: 20,        // 20 seconds target
    consistencyThreshold: 0.85, // 85% consistent performance
    requiredRepetitions: 3     // Must demonstrate mastery 3 times
  };

  async updateMasteryProgress(
    studentId: string,
    conceptId: string,
    performance: {
      correct: boolean;
      timeSpent: number;
      difficulty: number;
    }
  ): Promise<void> {
    try {
      // Get current mastery metrics
      const currentMetrics = await this.getMasteryMetrics(studentId, conceptId);
      
      // Update metrics
      const updatedMetrics = this.calculateNewMetrics(currentMetrics, performance);
      
      // Check for mastery achievement
      const hasMastered = this.checkMastery(updatedMetrics);

      // Update database
      await prisma.conceptMastery.upsert({
        where: {
          studentId_conceptId: {
            studentId,
            conceptId
          }
        },
        update: {
          metrics: updatedMetrics,
          achieved: hasMastered,
          updatedAt: new Date()
        },
        create: {
          studentId,
          conceptId,
          metrics: updatedMetrics,
          achieved: hasMastered
        }
      });

      logger.info('Mastery progress updated', {
        studentId,
        conceptId,
        metrics: updatedMetrics,
        mastered: hasMastered
      });
    } catch (error) {
      logger.error('Failed to update mastery progress', {
        studentId,
        conceptId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async getMasteryMetrics(
    studentId: string,
    conceptId: string
  ): Promise<MasteryMetrics> {
    const record = await prisma.conceptMastery.findUnique({
      where: {
        studentId_conceptId: {
          studentId,
          conceptId
        }
      }
    });

    return record?.metrics || {
      accuracy: 0,
      speed: 0,
      consistency: 0,
      repetitions: 0
    };
  }

  private calculateNewMetrics(
    currentMetrics: MasteryMetrics,
    performance: {
      correct: boolean;
      timeSpent: number;
      difficulty: number;
    }
  ): MasteryMetrics {
    const { correct, timeSpent, difficulty } = performance;
    const { accuracy, speed, consistency, repetitions } = currentMetrics;

    // Update accuracy (weighted by difficulty)
    const newAccuracy = (accuracy * repetitions + (correct ? difficulty : 0)) / (repetitions + 1);

    // Update speed (weighted moving average)
    const speedWeight = 0.7;
    const newSpeed = speed === 0 ? timeSpent : (speed * speedWeight + timeSpent * (1 - speedWeight));

    // Update consistency (variance in performance)
    const expectedTime = speed === 0 ? timeSpent : speed;
    const timeDeviation = Math.abs(timeSpent - expectedTime) / expectedTime;
    const newConsistency = consistency === 0 ? 
      1 : (consistency * repetitions + (1 - timeDeviation)) / (repetitions + 1);

    return {
      accuracy: newAccuracy,
      speed: newSpeed,
      consistency: newConsistency,
      repetitions: repetitions + 1
    };
  }

  private checkMastery(metrics: MasteryMetrics): boolean {
    const thresholds = MasteryTracker.DEFAULT_THRESHOLDS;

    return (
      metrics.accuracy >= thresholds.accuracyThreshold &&
      metrics.speed <= thresholds.speedThreshold &&
      metrics.consistency >= thresholds.consistencyThreshold &&
      metrics.repetitions >= thresholds.requiredRepetitions
    );
  }
} 