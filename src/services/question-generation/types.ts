export type Subject = 'mathematics' | 'english';
export type KeyStage = 1 | 2;
export type Year = 1 | 2 | 3 | 4 | 5 | 6;
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multipleChoice' | 'fillInBlank' | 'openEnded' | 'mathematical';

export interface CurriculumMapping {
  subject: Subject;
  keyStage: KeyStage;
  year: Year;
  term: number;
  unit: string;
  topic: string;
  learningObjectives: string[];
}

export interface QuestionTemplate {
  id: string;
  template: string;
  difficulty: string;
}

export interface QuestionStructure {
  multipleChoice?: MultipleChoiceStructure;
  fillInBlank?: FillInBlankStructure;
  openEnded?: OpenEndedStructure;
  mathematical?: MathematicalStructure;
}

export interface Question {
  id: string;
  content: string;
  type: string;
  difficulty: string;
  scaffolding: ScaffoldingRule[];
  adaptations: string[];
  resources: string[];
  variables: Record<string, any>;
  validationRules: ValidationRule[];
}

export interface ScaffoldingRule {
  type: string;
  content: string;
}

export interface ValidationRule {
  type: string;
  value: any;
}

export interface GenerationRequest {
  type: string;
  template: string;
  variables: Record<string, any>;
}

export interface GenerationStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface GeneratedQuestion {
  id: string;
  template: any;
  content: string;
  answer?: string;
  options?: string[];
  distractors: string[];
  explanation?: string;
  hints?: string[];
  metadata: {
    curriculum: CurriculumMapping;
    difficulty: DifficultyLevel;
    generated: string;
  };
}

export interface MultipleChoiceStructure {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface FillInBlankStructure {
  before: string;
  blank: string;
  after: string;
}

export interface OpenEndedStructure {
  question: string;
  sampleAnswer: string;
  rubric: string[];
}

export interface MathematicalStructure {
  problem: string;
  solution: string;
  steps: string[];
} 