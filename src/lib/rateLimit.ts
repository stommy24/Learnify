import { redis } from './redis';
import { NextApiRequest, NextApiResponse } from 'next';

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;

export async function rateLimit(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const key = `ratelimit:${ip}`;

  const requests = await redis.incr(key);
  
  if (requests === 1) {
    await redis.expire(key, WINDOW_SIZE_IN_SECONDS);
  }

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_WINDOW - requests));

  if (requests > MAX_REQUESTS_PER_WINDOW) {
    throw new Error('Too many requests');
  }
} 