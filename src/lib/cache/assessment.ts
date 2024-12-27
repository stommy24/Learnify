import { Redis as IoRedis } from 'ioredis';
import { AssessmentResult, ScoreCard, PerformanceMetrics } from '@/types/assessment';
import { Redis } from '@upstash/redis';

export class AssessmentCache {
  private redis: Redis;
  private readonly TTL = 60 * 60; // 1 hour
  constructor() {
    this.redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN
    });
  }

  async cacheResult(userId: string, result: AssessmentResult): Promise<void> {
    const key = `assessment:result:${userId}:${result.questionId}`;
    await this.redis.setex(key, this.TTL, JSON.stringify(result));
  }

  async cacheScoreCard(userId: string, scoreCard: ScoreCard): Promise<void> {
    const key = `assessment:score:${userId}`;
    await this.redis.setex(key, this.TTL, JSON.stringify(scoreCard));
  }

  async cacheMetrics(userId: string, metrics: PerformanceMetrics): Promise<void> {
    const key = `assessment:metrics:${userId}`;
    await this.redis.setex(key, this.TTL, JSON.stringify(metrics));
  }

  async getResult(userId: string, questionId: string): Promise<AssessmentResult | null> {
    const key = `assessment:result:${userId}:${questionId}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  }

  async getScoreCard(userId: string): Promise<ScoreCard | null> {
    const key = `assessment:score:${userId}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  }

  async getMetrics(userId: string): Promise<PerformanceMetrics | null> {
    const key = `assessment:metrics:${userId}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  }
} 