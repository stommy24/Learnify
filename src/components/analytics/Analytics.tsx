import { useEffect } from 'react';
import { MetricsService } from '../../monitoring/metrics';

export function Analytics() {
  useEffect(() => {
    // Initialize performance monitoring
    const metrics = MetricsService.getInstance();
    
    // Track page load performance
    if (window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      metrics.recordLoadTime(navigation.loadEventEnd - navigation.startTime);
    }

    // Track client-side errors
    window.addEventListener('error', (event) => {
      metrics.recordError({
        message: event.message,
        source: event.filename,
        line: event.lineno
      });
    });

    // Track network requests
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          metrics.recordNetworkRequest(entry);
        });
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }, []);

  return null;
} 
