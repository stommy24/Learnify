import Redis from 'ioredis';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';

class RedisService {
  private client: Redis;
  private defaultTTL: number;

  constructor() {
    this.client = new Redis(config.redis.url, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.defaultTTL = config.cache.defaultTTL;

    this.client.on('error', (error) => {
      logger.error('Redis Client Error:', error);
    });

    this.client.on('connect', () => {
      logger.info('Redis Client Connected');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis Get Error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, stringValue);
      } else {
        await this.client.setex(key, this.defaultTTL, stringValue);
      }
    } catch (error) {
      logger.error('Redis Set Error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis Delete Error:', error);
    }
  }

  async flush(): Promise<void> {
    try {
      await this.client.flushall();
    } catch (error) {
      logger.error('Redis Flush Error:', error);
    }
  }
}

export const redisService = new RedisService(); 