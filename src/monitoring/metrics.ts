import { Metrics } from '@opentelemetry/api-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { logger } from '../utils/logger';

export class MetricsService {
  private static instance: MetricsService;
  private metrics: Metrics;
  private exporter: PrometheusExporter;

  private constructor() {
    this.exporter = new PrometheusExporter();
    this.metrics = this.exporter.getMeterProvider().getMeter('learnify');
    this.setupMetrics();
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  public recordLoadTime(duration: number) {
    this.metrics.createHistogram('page_load_time').record(duration);
  }

  public recordError(error: { message: string; source?: string; line?: number }) {
    logger.error('Client Error:', error);
    this.metrics.createCounter('client_errors').add(1);
  }

  public recordNetworkRequest(entry: PerformanceEntry) {
    this.metrics.createHistogram('network_request_duration').record(entry.duration);
  }

  private setupMetrics() {
    // Core metrics
    this.metrics.createCounter('page_views');
    this.metrics.createHistogram('api_response_time');
    this.metrics.createUpDownCounter('active_users');
    
    // Performance metrics
    this.metrics.createHistogram('js_heap_size');
    this.metrics.createHistogram('dom_nodes');
    this.metrics.createHistogram('first_contentful_paint');
  }
} 