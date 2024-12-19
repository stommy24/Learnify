import { MetricsAggregator } from './metrics';
import { AlertManager } from './alerts';

export class MonitoringDashboard {
  private metrics: MetricsAggregator;
  private alerts: AlertManager;

  constructor() {
    this.metrics = new MetricsAggregator();
    this.alerts = new AlertManager();
  }

  async initialize() {
    await this.metrics.connect();
    await this.alerts.initialize();
    this.setupMetricsCollection();
  }

  private setupMetricsCollection() {
    // Collect system metrics
    setInterval(() => {
      this.metrics.collectSystemMetrics();
    }, 60000);

    // Collect application metrics
    setInterval(() => {
      this.metrics.collectAppMetrics();
    }, 30000);
  }
} 