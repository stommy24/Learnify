export type SubjectArea = 'maths' | 'english';
export type KeyStage = 1 | 2 | 3;  // UK Key Stages (Years 1-9)

export interface CurriculumStandard {
  id: string;
  code: string;
  description: string;
  objectives: LearningObjective[];
  topics: CurriculumTopic[];
}

export interface CurriculumTopic {
  id: string;
  name: string;
  standards: CurriculumStandard[];
  prerequisites: string[];
  difficulty: number;
  ageRange: [number, number];
  strand: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface LearningObjective {
  id: string;
  description: string;
  level: number;
}

export interface LearningStyleMapping {
  visual: QuestionAdaptation[];
  auditory: QuestionAdaptation[];
  kinesthetic: QuestionAdaptation[];
  readingWriting: QuestionAdaptation[];
}

export interface QuestionAdaptation {
  type: string;
  format: 'visual_diagram' | 'text' | 'audio_narration' | 'interactive_manipulative';
  description: string;
  content?: string;
  scaffolding?: string[];
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'numeric' | 'open-ended';

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

export interface TopicConnection {
  source: string;
  target: string;
  type: 'prerequisite' | 'related';
} 