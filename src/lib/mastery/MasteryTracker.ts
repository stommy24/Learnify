import prisma from '@/lib/db';
import { logger } from '@/lib/monitoring';
import { Prisma } from '@prisma/client';

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
      const currentMetrics = await this.getMasteryMetrics(studentId, conceptId);
      const updatedMetrics = this.calculateNewMetrics(currentMetrics, performance);
      const hasMastered = this.checkMastery(updatedMetrics);

      await prisma.conceptMastery.upsert({
        where: {
          studentId_conceptId: {
            studentId,
            conceptId
          }
        },
        update: {
          metrics: updatedMetrics as unknown as Prisma.InputJsonValue,
          achieved: hasMastered,
          updatedAt: new Date()
        },
        create: {
          studentId,
          conceptId,
          metrics: updatedMetrics as unknown as Prisma.InputJsonValue,
          achieved: hasMastered
        }
      });

      logger.info('Mastery progress updated', {
        studentId,
        conceptId,
        metrics: updatedMetrics,
        mastered: hasMastered
      });
    } catch (err) {
      const error = new Error(`Error updating mastery for student ${studentId}, concept ${conceptId}`);
      logger.error(error, error);
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

    return (record?.metrics as unknown as MasteryMetrics) || {
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

  public async getMetricsForDifficulty(studentId: string, conceptId: string) {
    return this.getMasteryMetrics(studentId, conceptId);
  }
} 