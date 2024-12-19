export interface PerformanceMetric {
  date: string;
  score: number;
  average: number;
  target: number;
}

export interface EngagementMetric {
  date: string;
  active: number;
  completed: number;
}

export type PerformanceMetrics = PerformanceMetric[];
export type EngagementMetrics = EngagementMetric[]; 