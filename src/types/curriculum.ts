export type SubjectArea = 'maths' | 'english';
export type KeyStage = 1 | 2 | 3;  // UK Key Stages (Years 1-9)

export interface CurriculumStandard {
  subject: SubjectArea;
  keyStage: KeyStage;
  year: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  topics: CurriculumTopic[];
}

export interface CurriculumTopic {
  id: string;
  name: string;
  strand?: string; // e.g., "Number", "Algebra" for maths, "Reading", "Writing" for English
  objectives: LearningObjective[];
  prerequisites: string[];  // Topic IDs
  difficulty: 1 | 2 | 3 | 4 | 5;
  ageRange: {
    min: number;
    max: number;
  };
}

export interface LearningObjective {
  id: string;
  description: string;
  examples: string[];
  questionTypes: QuestionType[];
  learningStyles: LearningStyleMapping;
  assessmentCriteria: string[];
}

export interface LearningStyleMapping {
  visual: QuestionAdaptation[];
  auditory: QuestionAdaptation[];
  kinesthetic: QuestionAdaptation[];
  readingWriting: QuestionAdaptation[];
}

export interface QuestionAdaptation {
  format: string;
  adaptationRules: string[];
  resources: string[];
}

export interface QuestionType {
  type: string;
  template: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  variables: QuestionVariable[];
  validationRules: ValidationRule[];
  scaffolding?: ScaffoldingRule[];
}

export interface QuestionVariable {
  name: string;
  type: 'number' | 'string' | 'array' | 'equation' | 'text';
  range?: {
    min: number;
    max: number;
  };
  options?: string[];
  constraints?: string[];
}

export interface ValidationRule {
  type: 'range' | 'pattern' | 'exact' | 'method';
  value: any;
  errorMessage: string;
  remedialHint?: string;
}

export interface ScaffoldingRule {
  condition: string;
  hint: string;
  example?: string;
  nextStep?: string;
} 