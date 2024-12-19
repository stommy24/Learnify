export type CheckpointLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CheckpointRule {
  id: string;
  topic: string;
  area: string;
  level: CheckpointLevel;
  minScore: number;
  prerequisites?: string[];
}

export interface CheckpointAttempt {
  id: string;
  userId: string;
  checkpointId: string;
  score: number;
  completed: boolean;
  timestamp: Date;
}

export enum CheckpointErrorCode {
  RULES_NOT_FOUND = 'RULES_NOT_FOUND',
  LEVEL_NOT_FOUND = 'LEVEL_NOT_FOUND',
  CHECKPOINT_EVALUATION_ERROR = 'CHECKPOINT_EVALUATION_ERROR',
  REMEDIAL_GENERATION_ERROR = 'REMEDIAL_GENERATION_ERROR'
}

export class CheckpointError extends Error {
  constructor(
    public code: CheckpointErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'CheckpointError';
  }
} 