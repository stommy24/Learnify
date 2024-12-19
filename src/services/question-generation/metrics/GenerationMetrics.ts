import { performanceMonitor } from '@/lib/monitoring/performance';
import { redisService } from '@/lib/cache/redis';
import { GenerationMetrics, Question } from '../types';

export class MetricsCollector {
  private readonly METRICS_PREFIX = 'question_generation_metrics:';

  async recordMetrics(
    requestId: string,
    metrics: GenerationMetrics,
    questions: Question[]
  ): Promise<void> {
    const timestamp = Date.now();

    // Store detailed metrics
    await redisService.set(
      `${this.METRICS_PREFIX}${requestId}`,
      {
        timestamp,
        metrics,
        questionCount: questions.length,
        questionTypes: questions.map(q => q.type),
        averageValidationScore: this.calculateAverageValidationScore(questions)
      },
      60 * 60 * 24 // 24 hour TTL
    );

    // Update running averages
    await this.updateAggregateMetrics(metrics);
  }

  private async updateAggregateMetrics(metrics: GenerationMetrics): Promise<void> {
    const key = `${this.METRICS_PREFIX}aggregate`;
    const current = await redisService.get(key) || {
      totalGenerations: 0,
      averageGenerationTime: 0,
      averageValidationScore: 0,
      totalTokenUsage: 0
    };

    const updated = {
      totalGenerations: current.totalGenerations + 1,
      averageGenerationTime: this.calculateRunningAverage(
        current.averageGenerationTime,
        metrics.generationTime,
        current.totalGenerations
      ),
      averageValidationScore: this.calculateRunningAverage(
        current.averageValidationScore,
        metrics.validationScore,
        current.totalGenerations
      ),
      totalTokenUsage: current.totalTokenUsage + metrics.tokenUsage.total
    };

    await redisService.set(key, updated);
  }

  private calculateRunningAverage(
    currentAvg: number,
    newValue: number,
    count: number
  ): number {
    return (currentAvg * count + newValue) / (count + 1);
  }

  private calculateAverageValidationScore(questions: Question[]): number {
    return questions.reduce((acc, q) => 
      acc + (q.validation.issues?.length ? 0 : 1), 0) / questions.length;
  }
} 