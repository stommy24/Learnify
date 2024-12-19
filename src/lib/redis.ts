import Redis from 'ioredis';
import { logger } from './logger';

const redis = new Redis(process.env.REDIS_URL as string);

redis.on('error', (error) => {
  logger.error('Redis Error:', error);
});

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

export { redis }; 