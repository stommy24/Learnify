export interface Subject {
  id: string;
  name: string;
  topics: string[];
}

export interface Question {
  id: string;
  topic: string;
  type: string;
  points: number;
  question: string;
  answers: string[];
  correctAnswer: string;
  difficulty: number;
}

export interface QuizConfig {
  topics: string[];
  yearGroup: number;
  term: number;
  difficulty: number;
}

export interface GeneratedQuiz {
  id: string;
  questions: Question[];
  config: QuizConfig;
} 