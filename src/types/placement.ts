export enum PlacementTestStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  NUMERIC = 'NUMERIC',
  TEXT = 'TEXT'
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

export interface PlacementQuestion {
  id: string;
  sectionId: string;
  content: string;
  type: QuestionType;
  correctAnswer: string;
  answer?: string;
  timeSpent: number;
  isCorrect?: boolean;
  difficulty: number;
} 