import { BaseMetadata } from './base';
import { QuestionValidation } from './questions';

export interface ValidationResult extends QuestionValidation {
  curriculumAlignment: number;
  metadata: ValidationMetadata;
}

export interface ValidationMetadata extends BaseMetadata {
  coverage: number;
  clarity: number;
  technicalAccuracy: number;
  pedagogicalSoundness: number;
}

export interface LanguageValidation {
  isAppropriate: boolean;
  readabilityScore: number;
  issues: {
    complexity: string[];
    clarity: string[];
    terminology: string[];
  };
  suggestions: string[];
  metadata: LanguageMetadata;
}

export interface LanguageMetadata {
  wordCount: number;
  sentenceCount: number;
  averageWordLength: number;
  averageSentenceLength: number;
  technicalTerms: string[];
  readabilityMetrics: ReadabilityMetrics;
}

export interface ReadabilityMetrics {
  fleschKincaid: number;
  automatedReadability: number;
  colemanLiau: number;
} 