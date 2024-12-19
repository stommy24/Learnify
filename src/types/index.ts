export interface Question {
  id: string;
  content: string;
  type: 'multiple' | 'open' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: string;
  value: any;
}

export interface GenerationMetrics {
  totalGenerations: number;
  averageGenerationTime: number;
  averageValidationScore: number;
  totalTokenUsage: number;
}

export interface GenerationRequest {
  type: string;
  parameters: Record<string, any>;
  template?: QuestionTemplate;
}

export interface GenerationStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}

export interface QuestionTemplate {
  id: string;
  content: string;
  variables: Record<string, any>;
}

export interface LearningPath {
  title: string;
  progress: number;
  nextLesson: string;
  estimatedTime: string;
  currentModule: string;
}

export interface Performance {
  subject: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  recentTests: Array<{
    date: string;
    score: number;
  }>;
}

export interface Schedule {
  time: string;
  subject: string;
  topic: string;
  duration: string;
}

export interface RealTimeUpdate {
  type: 'learning' | 'performance' | 'schedule';
  data: LearningPath | Performance | Schedule;
  timestamp: string;
} 