export type Subject = 'mathematics' | 'english';
export type KeyStage = 1 | 2;
export type Year = 1 | 2 | 3 | 4 | 5 | 6;
export type Term = 1 | 2 | 3;

export interface CurriculumMapping {
  subject: Subject;
  keyStage: KeyStage;
  year: Year;
  term: Term;
  unit: string;
  topic: string;
  subtopic?: string;
  learningObjectives: string[];
  prerequisites?: string[];
}

export interface CurriculumStandard {
  id: string;
  code: string;
  description: string;
  examples: string[];
  prerequisites: string[];
  nextSteps: string[];
}

export interface CurriculumProgression {
  current: CurriculumStandard;
  previous?: CurriculumStandard;
  next?: CurriculumStandard;
} 