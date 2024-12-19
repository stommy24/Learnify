import { NextApiRequest, NextApiResponse } from 'next';
import { performanceMonitor } from '@/lib/monitoring/performance';
import { logger } from '@/utils/logger';

export const monitoringMiddleware = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const route = `${req.method} ${req.url}`;
    const endTimer = performanceMonitor.startTimer(route);
    
    // Track response size
    const originalJson = res.json;
    res.json = function(body: any) {
      const responseSize = JSON.stringify(body).length;
      logger.info(`Response size for ${route}: ${responseSize} bytes`);
      return originalJson.call(this, body);
    };

    try {
      // Execute handler
      const result = await handler(req, res);
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  };
}; 