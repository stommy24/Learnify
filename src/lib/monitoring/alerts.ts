import { Logger } from './logger';
import { MetricsCollector } from './metrics';

export interface AlertThreshold {
  metric: string;
  condition: 'gt' | 'lt' | 'eq';
  value: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

export class AlertSystem {
  private static instance: AlertSystem;
  private logger: Logger;
  private metricsCollector: MetricsCollector;
  private thresholds: AlertThreshold[];
  private alertHistory: Map<string, Date>;

  private constructor() {
    this.logger = Logger.getInstance();
    this.metricsCollector = MetricsCollector.getInstance();
    this.thresholds = this.initializeThresholds();
    this.alertHistory = new Map();
    this.startMonitoring();
  }

  static getInstance(): AlertSystem {
    if (!AlertSystem.instance) {
      AlertSystem.instance = new AlertSystem();
    }
    return AlertSystem.instance;
  }

  private initializeThresholds(): AlertThreshold[] {
    return [
      // Performance Alerts
      {
        metric: 'questionGenerationTime',
        condition: 'gt',
        value: 1000, // 1 second
        severity: 'warning',
        message: 'Question generation time exceeding threshold'
      },
      {
        metric: 'cacheHitRate',
        condition: 'lt',
        value: 0.7,
        severity: 'info',
        message: 'Cache hit rate below target'
      },
      // Error Rate Alerts
      {
        metric: 'errorRate',
        condition: 'gt',
        value: 0.05,
        severity: 'critical',
        message: 'High error rate detected'
      },
      // Learning Progress Alerts
      {
        metric: 'successRate',
        condition: 'lt',
        value: 0.6,
        severity: 'warning',
        message: 'Student success rate below threshold'
      },
      // Resource Usage Alerts
      {
        metric: 'memoryUsage',
        condition: 'gt',
        value: 0.85,
        severity: 'critical',
        message: 'High memory usage detected'
      }
    ];
  }

  private startMonitoring() {
    setInterval(() => this.checkMetrics(), 60000); // Check every minute
  }

  private async checkMetrics() {
    const metrics = this.metricsCollector.getMetricsSummary();
    
    for (const threshold of this.thresholds) {
      const currentValue = this.extractMetricValue(metrics, threshold.metric);
      
      if (this.shouldTriggerAlert(currentValue, threshold)) {
        await this.triggerAlert(threshold, currentValue);
      }
    }
  }

  private extractMetricValue(metrics: any, metricPath: string): number {
    return metricPath.split('.').reduce((obj, key) => obj?.[key], metrics);
  }

  private shouldTriggerAlert(value: number, threshold: AlertThreshold): boolean {
    const lastAlert = this.alertHistory.get(threshold.metric);
    const cooldownPeriod = this.getCooldownPeriod(threshold.severity);
    
    if (lastAlert && Date.now() - lastAlert.getTime() < cooldownPeriod) {
      return false;
    }

    switch (threshold.condition) {
      case 'gt':
        return value > threshold.value;
      case 'lt':
        return value < threshold.value;
      case 'eq':
        return value === threshold.value;
      default:
        return false;
    }
  }

  private getCooldownPeriod(severity: string): number {
    switch (severity) {
      case 'critical':
        return 5 * 60 * 1000; // 5 minutes
      case 'warning':
        return 15 * 60 * 1000; // 15 minutes
      case 'info':
        return 30 * 60 * 1000; // 30 minutes
      default:
        return 60 * 60 * 1000; // 1 hour
    }
  }

  private async triggerAlert(threshold: AlertThreshold, value: number) {
    const alert = {
      timestamp: new Date(),
      severity: threshold.severity,
      metric: threshold.metric,
      value,
      message: threshold.message,
      threshold: threshold.value
    };

    // Log alert
    this.logger.info('Alert Triggered', {
      event: 'alert',
      ...alert
    });

    // Update alert history
    this.alertHistory.set(threshold.metric, new Date());

    // Send notifications based on severity
    await this.sendNotifications(alert);
  }

  private async sendNotifications(alert: any) {
    switch (alert.severity) {
      case 'critical':
        await this.sendUrgentNotification(alert);
        break;
      case 'warning':
        await this.sendWarningNotification(alert);
        break;
      case 'info':
        await this.sendInfoNotification(alert);
        break;
    }
  }

  private async sendUrgentNotification(alert: any) {
    // Implement urgent notification (e.g., SMS, phone call)
    this.logger.info('Urgent Notification Sent', {
      event: 'notification',
      type: 'urgent',
      alert
    });
  }

  private async sendWarningNotification(alert: any) {
    // Implement warning notification (e.g., email)
    this.logger.info('Warning Notification Sent', {
      event: 'notification',
      type: 'warning',
      alert
    });
  }

  private async sendInfoNotification(alert: any) {
    // Implement info notification (e.g., dashboard update)
    this.logger.info('Info Notification Sent', {
      event: 'notification',
      type: 'info',
      alert
    });
  }
} 