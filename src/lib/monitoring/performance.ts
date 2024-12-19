import { Performance } from 'perf_hooks';
import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/nextjs';
import { config } from '@/config/environment';

class PerformanceMonitor {
  private metrics: Map<string, number[]>;

  constructor() {
    this.metrics = new Map();
  }

  startTimer(label: string): () => void {
    const start = Performance.now();
    
    return () => {
      const duration = Performance.now() - start;
      this.recordMetric(label, duration);
      
      // Report to monitoring if threshold exceeded
      if (duration > 1000) { // 1 second threshold
        logger.warn(`Slow operation detected: ${label} took ${duration}ms`);
        Sentry.addBreadcrumb({
          category: 'performance',
          message: `${label} operation took ${duration}ms`,
          level: 'warning',
        });
      }
    };
  }

  private recordMetric(label: string, duration: number) {
    const metrics = this.metrics.get(label) || [];
    metrics.push(duration);
    this.metrics.set(label, metrics.slice(-100)); // Keep last 100 measurements
  }

  getMetrics(label: string) {
    const metrics = this.metrics.get(label) || [];
    return {
      avg: metrics.reduce((a, b) => a + b, 0) / metrics.length,
      min: Math.min(...metrics),
      max: Math.max(...metrics),
      p95: this.calculatePercentile(metrics, 95),
    };
  }

  private calculatePercentile(metrics: number[], percentile: number): number {
    const sorted = [...metrics].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

export const performanceMonitor = new PerformanceMonitor(); 