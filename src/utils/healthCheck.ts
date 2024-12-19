import { prisma } from '../db';
import { redis } from '../db/redis';
import { logger } from './logger';

export class HealthCheck {
  async checkDatabase(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  async checkRedis(): Promise<boolean> {
    try {
      await redis.ping();
      return true;
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }

  async checkAll(): Promise<Record<string, boolean>> {
    return {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
    };
  }
} 