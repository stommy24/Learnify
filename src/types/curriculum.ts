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
  subject: 'maths' | 'english';
  keyStage: 1 | 2 | 3 | 4;
  year: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  title: string;
  name?: string; // Optional for backward compatibility
  objectives: string[];
  prerequisites: string[];
  difficulty: number;
  level: string;
  ageRange: number[];
  position?: { x: number; y: number }; // For visualization
  strand?: string; // Made optional since it's specific to subjects
}

export interface Topic {
  id: string;
  subject: string;
  keyStage: number;
  year: number;
  title: string;
  name: string;
  ageRange: [number, number];
  objectives: string[];
  prerequisites: string[];
  difficulty: number;
  level: string;
  position: { x: number; y: number };
}

export interface EnglishTopic extends Topic {
  subject: 'english';
  strand: "reading" | "writing" | "grammar" | "speaking" | "listening" | "literature";
}

export interface MathsTopic extends Topic {
  subject: 'maths';
  strand: "number" | "algebra" | "geometry" | "statistics" | "ratio" | "measurement";
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

// Additional types needed for services
export interface AssessmentResult {
  topicId: string;
  score: number;
  completedAt: Date;
  timeSpent: number;
}

export interface StudentProgress {
  currentLevel: string;
  completedTopics: string[];
  assessmentResults: AssessmentResult[];
}

export interface Worksheet {
  questions: any[]; // Define specific question type if available
  timeLimit: number;
  difficulty: number;
}

export interface Lesson {
  topicId: string;
  content: any; // Define specific content type if available
  duration: number;
  prerequisites: string[];
} 