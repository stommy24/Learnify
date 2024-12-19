export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  settings: AssessmentSettings;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface AssessmentSettings {
  timeLimit: number;
  passingScore: number;
  allowReview: boolean;
  randomizeQuestions: boolean;
} 