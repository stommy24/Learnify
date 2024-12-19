import { NextApiRequest, NextApiResponse } from 'next';
import { redisService } from '@/lib/cache/redis';

export const cacheMiddleware = (ttl?: number) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.url}`;

    try {
      // Try to get cached response
      const cachedResponse = await redisService.get(key);
      
      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      // Store original res.json to intercept the response
      const originalJson = res.json;
      res.json = function (body: any) {
        redisService.set(key, body, ttl);
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      next();
    }
  };
}; 