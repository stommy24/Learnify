export class MetricsLogger {
  recordTiming(name: string, durationMs: number) {
    // Implementation depends on your metrics service
    console.log(`Timing ${name}: ${durationMs}ms`);
  }

  increment(name: string) {
    console.log(`Increment ${name}`);
  }

  gauge(name: string, value: number) {
    console.log(`Gauge ${name}: ${value}`);
  }
} 