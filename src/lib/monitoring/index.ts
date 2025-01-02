import { Logtail } from '@logtail/node';
import { MetricsLogger } from './MetricsLogger';

const logtail = new Logtail(process.env.LOGTAIL_TOKEN!);
const metrics = new MetricsLogger();

export const logger = {
  info: (message: string, data?: any) => {
    console.info(message, data);
    logtail.info(message, data);
  },
  error: (error: Error, context?: any) => {
    console.error(error, context);
    logtail.error(error.message, { 
      ...context, 
      stack: error.stack 
    });
  },
  warn: (message: string, data?: any) => {
    console.warn(message, data);
    logtail.warn(message, data);
  }
};

export const monitor = {
  timing: (name: string, durationMs: number) => {
    metrics.recordTiming(name, durationMs);
  },
  increment: (name: string) => {
    metrics.increment(name);
  },
  gauge: (name: string, value: number) => {
    metrics.gauge(name, value);
  }
}; 