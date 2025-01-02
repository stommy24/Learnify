export enum PlacementTestStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple-choice',
  TEXT = 'text',
  NUMERIC = 'numeric',
  DRAWING = 'drawing',
  EQUATION = 'equation'
}

export enum AssessmentType {
  PLACEMENT = 'placement',
  PROGRESS = 'progress',
  LEVEL_END = 'level-end'
}

export interface InitialPlacementParams {
  age: number;
  gradeLevel?: number;
  previousExperience?: boolean;
  selfAssessment?: {
    confidence: number;
    subjectExperience: number;
  };
}

export interface DifficultyAdjustment {
  newLevel: number;
  reason: string;
  confidenceScore: number;
}

export interface PlacementTestResult {
  finalLevel: number;
  confidence: number;
  strongAreas: string[];
  weakAreas: string[];
  timePerformance: {
    average: number;
    fastest: number;
    slowest: number;
  };
  recommendations: string[];
}

export const DIFFICULTY_RULES = {
  INCREASE_THRESHOLD: 3,
  DECREASE_THRESHOLD: 2,
  TIME_LIMITS: {
    TOO_FAST: 10,
    TOO_SLOW: 120,
  },
  CONFIDENCE_THRESHOLD: 0.8,
  MIN_QUESTIONS_PER_LEVEL: 3
} as const;

export interface PlacementTest {
  id: string;
  studentId: string;
  status: PlacementTestStatus;
  startLevel: number;
  finalLevel?: number;
  sections: PlacementSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlacementSection {
  id: string;
  testId: string;
  level: number;
  score: number;
  timeSpent: number;
  status: PlacementTestStatus;
  questions: PlacementQuestion[];
}

export enum PlacementTestErrorCodes {
  INVALID_QUESTION = 'INVALID_QUESTION',
  INVALID_ANSWER = 'INVALID_ANSWER',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  TIMEOUT = 'TIMEOUT',
  TEST_NOT_FOUND = 'TEST_NOT_FOUND',
  TEST_ALREADY_COMPLETED = 'TEST_ALREADY_COMPLETED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  DATABASE_ERROR = 'DATABASE_ERROR'
}

export class PlacementTestError extends Error {
  constructor(
    public code: PlacementTestErrorCodes,
    message: string
  ) {
    super(message);
    this.name = 'PlacementTestError';
  }
}

export interface PlacementQuestion {
  id: string;
  type: QuestionType;
  content: string;
  correctAnswer: string;
  options?: string[];
  difficulty: number;
  conceptId: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  feedback?: string;
}

export interface Assessment {
  id: string;
  userId: string;
  type: AssessmentType;
  status: 'pending' | 'completed';
  score?: number;
  difficulty: number;
  conceptId: string;
  createdAt: Date;
  updatedAt: Date;
} 