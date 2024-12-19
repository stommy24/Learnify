import * as Sentry from '@sentry/nextjs';
import { Integrations } from '@sentry/tracing';
import { logger } from '@/lib/logger';

export function setupErrorMonitoring() {
  if (process.env.NODE_ENV === 'production') {
    try {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV,
        beforeSend(event) {
          // Sanitize sensitive data
          if (event.request?.headers) {
            delete event.request.headers['authorization'];
          }
          return event;
        },
      });

      logger.info('Sentry initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Sentry:', error);
    }
  }
} 