import { Redis } from 'ioredis';
import { PlacementQuestion } from '@/types/placement';

const redis = new Redis(process.env.REDIS_URL!);

export const questionCache = {
  async get(questionId: string): Promise<PlacementQuestion | null> {
    const cached = await redis.get(`question:${questionId}`);
    return cached ? JSON.parse(cached) : null;
  },

  async set(question: PlacementQuestion): Promise<void> {
    await redis.setex(
      `question:${question.id}`,
      3600, // 1 hour
      JSON.stringify(question)
    );
  },

  async invalidate(questionId: string): Promise<void> {
    await redis.del(`question:${questionId}`);
  }
};

export const rateLimitCache = {
  async increment(testId: string): Promise<number> {
    const key = `ratelimit:${testId}`;
    const count = await redis.incr(key);
    await redis.expire(key, 60); // 1 minute
    return count;
  }
}; 