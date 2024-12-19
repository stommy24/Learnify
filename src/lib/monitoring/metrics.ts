import { Logger } from './logger';
import { PerformanceObserver, performance } from 'perf_hooks';

export class MetricsCollector {
  private static instance: MetricsCollector;
  private logger: Logger;
  private metrics: Map<string, any>;
  private observer: PerformanceObserver;

  private constructor() {
    this.logger = Logger.getInstance();
    this.metrics = new Map();
    this.initializePerformanceObserver();
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  private initializePerformanceObserver() {
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.logger.logPerformance({
          operation: entry.name,
          duration: entry.duration,
          resourceUsage: process.resourceUsage()
        });
      });
    });

    this.observer.observe({ entryTypes: ['measure'], buffered: true });
  }

  // Learning Analytics Metrics
  trackLearningProgress(params: {
    studentId: string;
    topicId: string;
    objectiveId: string;
    score: number;
    timeSpent: number;
    mistakesMade: string[];
    hintsUsed: number;
    learningStyle: string;
  }) {
    performance.mark('learning-progress-start');
    
    this.logger.info('Learning Progress', {
      event: 'learning_progress',
      ...params,
      timestamp: new Date().toISOString()
    });

    // Track success rate by topic
    const topicKey = `topic-success-${params.topicId}`;
    if (!this.metrics.has(topicKey)) {
      this.metrics.set(topicKey, {
        attempts: 0,
        successes: 0,
        averageScore: 0,
        averageTime: 0
      });
    }

    const topicMetrics = this.metrics.get(topicKey);
    topicMetrics.attempts++;
    topicMetrics.successes += params.score >= 0.7 ? 1 : 0;
    topicMetrics.averageScore = (topicMetrics.averageScore * (topicMetrics.attempts - 1) + params.score) / topicMetrics.attempts;
    topicMetrics.averageTime = (topicMetrics.averageTime * (topicMetrics.attempts - 1) + params.timeSpent) / topicMetrics.attempts;

    performance.mark('learning-progress-end');
    performance.measure('learning-progress', 'learning-progress-start', 'learning-progress-end');
  }

  // System Performance Metrics
  trackSystemPerformance(params: {
    operation: string;
    startTime: number;
    endTime: number;
    cacheHits?: number;
    cacheMisses?: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
  }) {
    this.logger.info('System Performance', {
      event: 'system_performance',
      ...params,
      duration: params.endTime - params.startTime,
      timestamp: new Date().toISOString()
    });
  }

  // Question Generation Metrics
  trackQuestionGeneration(params: {
    questionType: string;
    difficulty: number;
    generationTime: number;
    adaptationTime: number;
    cacheHit: boolean;
    learningStyle: string;
  }) {
    performance.mark('question-generation-start');

    this.logger.info('Question Generation Metrics', {
      event: 'question_generation_metrics',
      ...params,
      timestamp: new Date().toISOString()
    });

    // Track average generation times
    const styleKey = `generation-time-${params.learningStyle}`;
    if (!this.metrics.has(styleKey)) {
      this.metrics.set(styleKey, {
        count: 0,
        totalTime: 0,
        cacheHits: 0
      });
    }

    const styleMetrics = this.metrics.get(styleKey);
    styleMetrics.count++;
    styleMetrics.totalTime += params.generationTime;
    if (params.cacheHit) styleMetrics.cacheHits++;

    performance.mark('question-generation-end');
    performance.measure('question-generation', 'question-generation-start', 'question-generation-end');
  }

  // Scaffolding Usage Metrics
  trackScaffoldingUsage(params: {
    studentId: string;
    questionId: string;
    hintsRequested: number;
    hintTypes: string[];
    timeToFirstHint: number;
    timeBetweenHints: number[];
    successAfterHints: boolean;
  }) {
    this.logger.info('Scaffolding Usage', {
      event: 'scaffolding_usage',
      ...params,
      timestamp: new Date().toISOString()
    });
  }

  // Error Rate Metrics
  trackErrorRates(params: {
    componentName: string;
    errorType: string;
    errorMessage: string;
    stackTrace?: string;
    context?: any;
  }) {
    this.logger.error('Error Tracking', {
      event: 'error_tracking',
      ...params,
      timestamp: new Date().toISOString()
    });

    // Track error frequencies
    const errorKey = `error-${params.componentName}-${params.errorType}`;
    if (!this.metrics.has(errorKey)) {
      this.metrics.set(errorKey, {
        count: 0,
        firstSeen: new Date(),
        lastSeen: new Date()
      });
    }

    const errorMetrics = this.metrics.get(errorKey);
    errorMetrics.count++;
    errorMetrics.lastSeen = new Date();
  }

  // Get aggregated metrics
  getMetricsSummary(): any {
    const summary: any = {};
    
    for (const [key, value] of this.metrics.entries()) {
      if (key.startsWith('topic-success-')) {
        summary.topicSuccess = summary.topicSuccess || {};
        summary.topicSuccess[key] = {
          successRate: value.successes / value.attempts,
          averageScore: value.averageScore,
          averageTime: value.averageTime
        };
      } else if (key.startsWith('generation-time-')) {
        summary.questionGeneration = summary.questionGeneration || {};
        summary.questionGeneration[key] = {
          averageTime: value.totalTime / value.count,
          cacheHitRate: value.cacheHits / value.count
        };
      } else if (key.startsWith('error-')) {
        summary.errors = summary.errors || {};
        summary.errors[key] = value;
      }
    }

    return summary;
  }

  // Reset metrics
  resetMetrics() {
    this.metrics.clear();
  }
} 