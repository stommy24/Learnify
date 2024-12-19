import React, { createContext, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import * as Sentry from '@sentry/nextjs';
import { MetricsService } from '@/lib/metrics';

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackError: (error: Error) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const metrics = MetricsService.getInstance();

  useEffect(() => {
    if (session?.user) {
      // Initialize user tracking
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email
      });
    }
  }, [session]);

  const trackEvent = (event: string, properties?: Record<string, any>) => {
    if (session?.user) {
      metrics.recordEvent(event, {
        userId: session.user.id,
        ...properties
      });
    }
  };

  const trackError = (error: Error) => {
    Sentry.captureException(error);
    metrics.recordError(error);
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackError }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}; 