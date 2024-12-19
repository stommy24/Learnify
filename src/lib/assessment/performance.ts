import { LRUCache } from 'lru-cache';
import { QuestionType, LearningObjective } from '@/types/curriculum';

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  
  private questionCache: LRUCache<string, QuestionType>;
  private objectiveCache: LRUCache<string, LearningObjective>;
  
  private constructor() {
    this.questionCache = new LRUCache({
      max: 500, // Maximum number of items
      ttl: 1000 * 60 * 60, // 1 hour TTL
      updateAgeOnGet: true
    });

    this.objectiveCache = new LRUCache({
      max: 1000,
      ttl: 1000 * 60 * 60 * 24 // 24 hours TTL
    });
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  getCachedQuestion(key: string): QuestionType | undefined {
    return this.questionCache.get(key);
  }

  cacheQuestion(key: string, question: QuestionType): void {
    this.questionCache.set(key, question);
  }

  getCachedObjective(key: string): LearningObjective | undefined {
    return this.objectiveCache.get(key);
  }

  cacheObjective(key: string, objective: LearningObjective): void {
    this.objectiveCache.set(key, objective);
  }

  generateCacheKey(params: {
    topicId: string;
    objectiveId: string;
    level: number;
    style: string;
  }): string {
    return `${params.topicId}-${params.objectiveId}-${params.level}-${params.style}`;
  }

  clearCache(): void {
    this.questionCache.clear();
    this.objectiveCache.clear();
  }

  async preloadCommonQuestions(
    objectives: LearningObjective[],
    levels: number[],
    styles: string[]
  ): Promise<void> {
    // Preload commonly used questions during idle time
    const preloadTasks = objectives.flatMap(objective =>
      levels.flatMap(level =>
        styles.map(style => {
          const key = this.generateCacheKey({
            topicId: objective.id,
            objectiveId: objective.id,
            level,
            style
          });
          if (!this.getCachedQuestion(key)) {
            // Generate and cache question
            // This would be done asynchronously during idle time
          }
        })
      )
    );

    await Promise.all(preloadTasks);
  }
} 