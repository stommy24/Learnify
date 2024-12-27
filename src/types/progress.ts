import { AssessmentResult } from '@/lib/types/assessment';
import { Adaptation as AdaptiveChange } from '@/types/adaptive';
import { ReactNode } from 'react';
import { LearningStyleMapping } from './curriculum';
import { QuestionType } from './generation';

export interface LearningProgress {
  id: string;
  userId: string;
  timestamp: Date;
  results: AssessmentResult[];
  adaptations: AdaptiveChange[];
  assessmentHistory: AssessmentResult[];
  objectiveIds: string[];
  masteryLevel: {
    [objectiveId: string]: number;
  };
}

export interface ProgressResult {
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
  learningStyle: keyof LearningStyleMapping;
  topicId?: string;
  mistakePatterns?: string[];
}

export interface TopicStrength {
  topicId: string;
  score: number;
  questionTypes: QuestionType[];
  consistencyRate: number;
}

export interface TopicWeakness {
  topicId: string;
  score: number;
  questionTypes: QuestionType[];
  commonMistakes: string[];
  recommendedPractice: string[];
}

export interface LearningAdaptations {
  preferredStyle: keyof LearningStyleMapping;
  difficultyLevel: number;
  pacePreference: 'slow' | 'medium' | 'fast';
  scaffoldingLevel: 'minimal' | 'moderate' | 'extensive';
  styleEffectiveness: Record<keyof LearningStyleMapping, number>;
}

export interface Adaptation {
  description: ReactNode;
  type: string;
  value: any;
  preferredStyle?: string;
  effectiveFormats?: string[];
  strugglingAreas?: string[];
}

export interface StudentProgress {
  id: string;
  userId: string;
  assessmentResults: AssessmentResult[];
  learningStyle?: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  lastUpdated: Date;
  topicId?: string;
  objectiveIds: string[];
  masteryLevel: number;
  assessmentHistory: AssessmentResult[];
  adaptations: AdaptiveChange[];
} 