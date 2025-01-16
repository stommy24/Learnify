import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define types that match your schema
export interface AssessmentResult {
  topicId: string;
  score: number;
  timestamp: Date;
}

export interface LearningProgressData {
  results: AssessmentResult[];
  strengths: Record<string, number>;
  weaknesses: Record<string, number>;
  adaptations: Record<string, any>;
}

export class ProgressionService {
  async getCurrentProgress(userId: string, topicId?: string) {
    const progress = await prisma.learningProgress.findFirst({
      where: { userId }
    });

    if (!progress) {
      // Create initial progress data matching schema
      const initialData: LearningProgressData = {
        results: [],
        strengths: {},
        weaknesses: {},
        adaptations: {}
      };

      return {
        id: uuidv4(),
        userId,
        timestamp: new Date(),
        ...initialData
      };
    }

    // Safely parse JSON fields from database
    const parsedResults = this.parseJsonField<AssessmentResult[]>(progress.results, []);
    const parsedStrengths = this.parseJsonField<Record<string, number>>(progress.strengths, {});
    const parsedWeaknesses = this.parseJsonField<Record<string, number>>(progress.weaknesses, {});
    const parsedAdaptations = this.parseJsonField<Record<string, any>>(progress.adaptations, {});

    return {
      ...progress,
      results: parsedResults,
      strengths: parsedStrengths,
      weaknesses: parsedWeaknesses,
      adaptations: parsedAdaptations
    };
  }

  private parseJsonField<T>(field: any, defaultValue: T): T {
    try {
      if (typeof field === 'string') {
        return JSON.parse(field);
      }
      return field as T;
    } catch {
      return defaultValue;
    }
  }

  async updateProgress(userId: string, results: AssessmentResult[]) {
    const existingProgress = await this.getCurrentProgress(userId);

    const resultsByTopic = results.reduce((acc, result) => {
      const { topicId } = result;
      if (!acc[topicId]) {
        acc[topicId] = [];
      }
      acc[topicId].push(result);
      return acc;
    }, {} as Record<string, AssessmentResult[]>);

    const averagedResults = Object.entries(resultsByTopic).map(([topicId, topicResults]) => {
      const averageScore = topicResults.reduce((sum, r) => sum + r.score, 0) / topicResults.length;
      return {
        topicId,
        score: averageScore,
        timestamp: new Date()
      };
    });

    // Calculate strengths and weaknesses based on results
    const { strengths, weaknesses } = this.analyzeResults(averagedResults);

    const updatedProgress = {
      ...existingProgress,
      userId,
      timestamp: new Date(),
      results: JSON.stringify([...existingProgress.results, ...averagedResults]),
      strengths: JSON.stringify(strengths),
      weaknesses: JSON.stringify(weaknesses),
      adaptations: JSON.stringify(existingProgress.adaptations || {})
    };

    await this.saveProgress(updatedProgress);
    
    // Return parsed data
    return {
      ...updatedProgress,
      results: this.parseJsonField<AssessmentResult[]>(updatedProgress.results, []),
      strengths: this.parseJsonField<Record<string, number>>(updatedProgress.strengths, {}),
      weaknesses: this.parseJsonField<Record<string, number>>(updatedProgress.weaknesses, {}),
      adaptations: this.parseJsonField<Record<string, any>>(updatedProgress.adaptations, {})
    };
  }

  private analyzeResults(results: AssessmentResult[]) {
    const strengths: Record<string, number> = {};
    const weaknesses: Record<string, number> = {};

    results.forEach(result => {
      if (result.score >= 0.7) {
        strengths[result.topicId] = result.score;
      } else {
        weaknesses[result.topicId] = result.score;
      }
    });

    return { strengths, weaknesses };
  }

  private async saveProgress(progress: any) {
    await prisma.learningProgress.upsert({
      where: { id: progress.id },
      update: progress,
      create: progress
    });
  }

  async getAllProgress(): Promise<Record<string, number>> {
    const progress = await prisma.learningProgress.findFirst();
    if (!progress) return {};
    
    const results = this.parseJsonField<AssessmentResult[]>(progress.results, []);
    return results.reduce((acc, result) => {
      acc[result.topicId] = result.score;
      return acc;
    }, {} as Record<string, number>);
  }

  createProgress(): LearningProgressData & { id: string; userId: string; timestamp: Date } {
    const initialData: LearningProgressData = {
      results: [],
      strengths: {},
      weaknesses: {},
      adaptations: {}
    };

    return {
      id: 'test-id',
      userId: 'test-user',
      timestamp: new Date(),
      ...initialData
    };
  }
} 