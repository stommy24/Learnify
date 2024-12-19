import compression from 'compression';
import { Express } from 'express';
import { MetricsService } from '../monitoring/metrics';

export const configurePerformance = (app: Express) => {
  // Enable compression
  app.use(compression());

  // Cache control headers
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    next();
  });
};

export const measurePerformance = (metricName: string) => {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      MetricsService.getInstance().recordCustomMetric(metricName, duration);
      return duration;
    }
  };
};

export const withPerformanceTracking = <T extends (...args: any[]) => any>(
  fn: T,
  metricName: string
) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const measure = measurePerformance(metricName);
    const result = fn(...args);
    measure.end();
    return result;
  };
}; 