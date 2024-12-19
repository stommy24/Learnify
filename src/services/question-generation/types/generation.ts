export interface GenerationRequest {
  curriculum: CurriculumMapping;
  difficulty: DifficultyLevel;
  count?: number;
  preferences?: GenerationPreferences;
  constraints?: GenerationConstraints;
}

export interface GenerationPreferences {
  questionTypes?: QuestionType[];
  includeHints: boolean;
  includeExplanations: boolean;
  difficultyProgression?: 'static' | 'adaptive' | 'progressive';
}

export interface GenerationConstraints {
  maxRetries: number;
  timeoutMs: number;
  uniquenessCheck: boolean;
  qualityThreshold: number;
}

export interface GenerationStatus {
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'not_found';
  progress?: number;
  result?: Question[];
  error?: string;
  timestamp: string;
}

export interface GenerationMetrics {
  generationTime: number;
  retryCount: number;
  validationScore: number;
  modelConfidence: number;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
} 