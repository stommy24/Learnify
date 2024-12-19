export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  api: ApiConfig;
  ai: AIConfig;
  assessment: AssessmentConfig;
  features: FeatureFlags;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  headers: Record<string, string>;
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'cohere';
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}

export interface AssessmentConfig {
  maxQuestions: number;
  timeLimit: number;
  passingScore: number;
  adaptiveDifficulty: boolean;
  allowHints: boolean;
  showFeedback: boolean;
}

export interface FeatureFlags {
  enableAI: boolean;
  enableAdaptiveLearning: boolean;
  enableRealTimeValidation: boolean;
  enableDetailedFeedback: boolean;
  enablePeerReview: boolean;
} 