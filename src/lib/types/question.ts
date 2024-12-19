export interface Question {
  id: string;
  content: string;
  type: string;
  difficulty: string;
  metadata: QuestionMetadata;
  scaffolding: ScaffoldingRule[];
  adaptations: string[];
  resources: string[];
  variables: Record<string, any>;
  validationRules: ValidationRule[];
}

export interface QuestionMetadata {
  yearGroup: number;
  term: string;
  difficulty: number;
  estimatedTime: number;
  skillsTested?: string[];
}

export interface AIQuestionRequest {
  type: string;
  difficulty: string;
  questionType: string;
  topic: string;
  constraints?: Record<string, any>;
}

export interface AIQuestionResponse {
  question: string;
  metadata: QuestionMetadata;
  validationRules: ValidationRule[];
} 