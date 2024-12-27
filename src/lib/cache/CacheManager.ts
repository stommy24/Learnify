import Redis, { RedisOptions } from 'ioredis';
export class CacheManager {
  private redis: Redis.Redis;

  constructor(options?: RedisOptions) {
    this.redis = new Redis(options);
  }

  async get<T>(key: string, p0: () => Promise<{ test: string; }>): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
} 