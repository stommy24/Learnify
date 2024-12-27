import type { Question, Answer, AssessmentResult, ScoreCard, PerformanceMetrics } from './assessment';

export interface AssessmentScenario {
  name: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  metadata: {
    difficulty: string;
    topic: string;
    gradeLevel: string;
  };
} 