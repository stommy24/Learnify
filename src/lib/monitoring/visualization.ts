import { ChartConfiguration } from 'chart.js';
import { MetricsCollector } from './metrics';

type ChartTypeRegistry = {
  heatmap: {
    type: 'heatmap';
    data: number[][];
    options: {
      colorScale: string[];
    };
  };
  bubble: {
    type: 'bubble';
    data: Array<{
      x: number;
      y: number;
      r: number;
    }>;
  };
};

interface Point {
  x: number;
  y: number;
}

interface BubbleDataPoint extends Point {
  r: number;
}

export class MetricsVisualizer {
  private static instance: MetricsVisualizer;
  private metricsCollector: MetricsCollector;

  private constructor() {
    this.metricsCollector = MetricsCollector.getInstance();
  }

  static getInstance(): MetricsVisualizer {
    if (!MetricsVisualizer.instance) {
      MetricsVisualizer.instance = new MetricsVisualizer();
    }
    return MetricsVisualizer.instance;
  }

  generateLearningProgressChart(): ChartConfiguration {
    const metrics = this.metricsCollector.getMetricsSummary();
    
    return {
      type: 'line',
      data: {
        labels: Object.keys(metrics.topicSuccess || {}),
        datasets: [
          {
            label: 'Success Rate',
            data: Object.values(metrics.topicSuccess || {}).map((m: any) => m.successRate),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Average Score',
            data: Object.values(metrics.topicSuccess || {}).map((m: any) => m.averageScore),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Learning Progress Over Time'
          }
        }
      }
    };
  }

  generatePerformanceHeatmap(): ChartConfiguration {
    const metrics = this.metricsCollector.getMetricsSummary();
    
    return {
      type: 'heatmap',
      data: {
        datasets: [{
          data: Object.entries(metrics.questionGeneration || {}).map(([key, value]: [string, any]) => ({
            x: key.split('-').pop(),
            y: 'Generation Time',
            v: value.averageTime
          }))
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Question Generation Performance'
          }
        }
      }
    };
  }

  generateErrorDashboard(): ChartConfiguration {
    const metrics = this.metricsCollector.getMetricsSummary();
    
    return {
      type: 'bar',
      data: {
        labels: Object.keys(metrics.errors || {}),
        datasets: [{
          label: 'Error Count',
          data: Object.values(metrics.errors || {}).map((e: any) => e.count),
          backgroundColor: 'rgb(255, 99, 132)'
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Error Distribution'
          }
        }
      }
    };
  }

  generateScaffoldingInsights(): ChartConfiguration {
    // Visualization for scaffolding effectiveness
    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Hint Usage vs Success Rate',
          data: [] // Populate with scaffolding metrics
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Scaffolding Effectiveness'
          }
        }
      }
    };
  }

  private createHeatmapConfig(data: number[][]): ChartConfiguration<'heatmap'> {
    return {
      type: 'heatmap',
      data: {
        datasets: [{
          data: data,
          backgroundColor: (context) => {
            const value = context.raw as number;
            return `rgba(255, 0, 0, ${value})`;
          }
        }]
      },
      options: {
        scales: {
          x: { type: 'linear' },
          y: { type: 'linear' }
        }
      }
    } as ChartConfiguration<'heatmap'>;
  }

  private createBubbleConfig(data: BubbleDataPoint[]): ChartConfiguration<'bubble'> {
    return {
      type: 'bubble',
      data: {
        datasets: [{
          data: data
        }]
      },
      options: {
        scales: {
          x: { type: 'linear' },
          y: { type: 'linear' }
        }
      }
    };
  }
} 