export interface RemedialContent {
  id: string;
  type: 'concept' | 'practice' | 'review';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  content: {
    explanation: string;
    examples: Example[];
    exercises: Exercise[];
    resources: Resource[];
  };
  prerequisites: string[];
  estimatedTime: number;
  order: number;
}

export interface Example {
  id: string;
  content: string;
  steps: string[];
  animation?: AnimationStep[];
}

export interface Exercise {
  id: string;
  question: string;
  type: 'practice' | 'reinforcement';
  difficulty: 1 | 2 | 3 | 4 | 5;
  solution: {
    answer: string;
    explanation: string;
    steps?: string[];
  };
}

export interface Resource {
  id: string;
  type: 'video' | 'text' | 'interactive';
  url: string;
  title: string;
  description: string;
}

export interface WeakPoint {
  topic: string;
  conceptGaps: string[];
  mistakePatterns: string[];
  confidenceLevel: number;
}

export interface PrerequisiteNode {
  id: string;
  topic: string;
  requiredMastery: number;
  dependencies: string[];
}

export interface AnimationStep {
  id: string;
  duration: number;
  type: string;
  properties: Record<string, any>;
}

export interface RemedialState {
  currentStep: number;
  steps: AnimationStep[];
  isPlaying: boolean;
  speed: number;
} 