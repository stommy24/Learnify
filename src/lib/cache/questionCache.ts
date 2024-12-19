import { Redis } from 'ioredis';
import { Question } from '@/types';

const redis = new Redis(process.env.REDIS_URL);

export class QuestionCache {
  private static readonly PREFIX = 'question:';
  private static readonly TTL = 60 * 60; // 1 hour

  static async get(key: string): Promise<Question | null> {
    const cached = await redis.get(`${this.PREFIX}${key}`);
    return cached ? JSON.parse(cached) : null;
  }

  static async set(key: string, question: Question): Promise<void> {
    await redis.setex(
      `${this.PREFIX}${key}`,
      this.TTL,
      JSON.stringify(question)
    );
  }

  static async invalidate(key: string): Promise<void> {
    await redis.del(`${this.PREFIX}${key}`);
  }

  static async getMany(keys: string[]): Promise<(Question | null)[]> {
    const pipeline = redis.pipeline();
    keys.forEach(key => {
      pipeline.get(`${this.PREFIX}${key}`);
    });
    
    const results = await pipeline.exec();
    return results.map(([err, result]) => 
      result ? JSON.parse(result as string) : null
    );
  }

  static async setMany(questions: Question[]): Promise<void> {
    const pipeline = redis.pipeline();
    questions.forEach(question => {
      pipeline.setex(
        `${this.PREFIX}${question.id}`,
        this.TTL,
        JSON.stringify(question)
      );
    });
    await pipeline.exec();
  }
} 