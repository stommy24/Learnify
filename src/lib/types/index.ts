// Core types without dependencies
export type Subject = 'maths' | 'english';

export type QuestionType = 
  | 'multiple-choice' 
  | 'true-false' 
  | 'short-answer' 
  | 'fill-blank';

export type MathsTopic = 
  | 'arithmetic'
  | 'algebra'
  | 'geometry'
  | 'statistics'
  | 'number_patterns'
  | 'word_problems'
  | 'fractions'
  | 'decimals'
  | 'percentages';

export type EnglishTopic = 
  | 'reading_comprehension'
  | 'grammar'
  | 'vocabulary'
  | 'spelling'
  | 'punctuation'
  | 'writing'
  | 'phonics';

export type Topic = MathsTopic | EnglishTopic;

// Base interfaces
export interface BaseResponse {
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface BaseMetadata {
  difficulty: number;
  estimatedTime: number;
  curriculumAlignment: number;
}

// Question interfaces
export interface Question {
  id: string;
  type: QuestionType;
  topic: Topic;
  content: QuestionContent;
  metadata: QuestionMetadata;
}

export interface QuestionContent {
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  hints?: string[];
}

export interface QuestionMetadata extends BaseMetadata {
  yearGroup: number;
  term: number;
  skillsTested?: string[];
}

// Validation interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  curriculumAlignment: number;
  metadata: ValidationMetadata;
}

export interface ValidationMetadata extends BaseMetadata {
  coverage: number;
  clarity: number;
  technicalAccuracy: number;
  pedagogicalSoundness: number;
}

// Assessment interfaces
export interface AssessmentConfig {
  subject: Subject;
  yearGroup: number;
  term: 1 | 2 | 3;
  topics: Topic[];
  questionCount: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeLimit?: number;
}

export interface Assessment {
  id: string;
  config: AssessmentConfig;
  questions: Question[];
  metadata: AssessmentMetadata;
}

export interface AssessmentMetadata extends BaseMetadata {
  generatedAt: Date;
  topicsCovered: Topic[];
  skillsAssessed?: string[];
}

// AI-related interfaces
export interface AIQuestionRequest {
  subject: Subject;
  topic: Topic;
  yearGroup: number;
  term: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  questionType: QuestionType;
  learningObjective: string;
}

export interface AIQuestionResponse {
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints: string[];
  metadata: {
    difficulty: number;
    estimatedTime: number;
    skillsTested?: string[];
  };
}

// Language validation interfaces
export interface LanguageValidationResult {
  isAppropriate: boolean;
  readabilityScore: number;
  issues: {
    complexity: string[];
    clarity: string[];
    terminology: string[];
  };
  suggestions: string[];
  metadata: {
    wordCount: number;
    sentenceCount: number;
    averageWordLength: number;
    averageSentenceLength: number;
    technicalTerms: string[];
    readabilityMetrics: {
      fleschKincaid: number;
      automatedReadability: number;
      colemanLiau: number;
    };
  };
}

// Curriculum interfaces
export interface CurriculumPrompt {
  subject: Subject;
  topic: Topic;
  yearGroup: number;
  term: number;
  basePrompt: string;
  requiredKeywords: string[];
  learningObjectives: string[];
  prerequisites?: string[];
  exampleQuestion?: string;
}

export interface CurriculumContent {
  version: string;
  lastUpdated: string;
  topics: Record<Topic, {
    yearGroups: Record<number, {
      terms: Record<number, {
        objectives: string[];
        keywords: string[];
        expectedOutcomes: string[];
        prerequisites?: string[];
        resources?: string[];
      }>;
    }>;
  }>;
}

// Quiz interfaces
export interface QuizAttempt {
  quizId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    timeTaken: number;
  }[];
  score?: number;
  feedback?: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  timeSpent: number;
  accuracy: number;
  topicPerformance: {
    topic: Topic;
    score: number;
    questions: number;
  }[];
  recommendations: string[];
}

// Service response types
export interface ServiceResponse<T> extends BaseResponse {
  data?: T;
  timestamp: number;
  requestId: string;
}

export type AsyncResult<T> = Promise<ServiceResponse<T>>; 

// Assessment attempt and progress tracking
export interface QuestionAttempt {
  questionId: string;
  answer?: string | string[];
  isCorrect?: boolean;
  timeTaken?: number;
  hintsUsed: string[];
  attempts: number;
}

export interface AssessmentProgress {
  currentQuestionIndex: number;
  timeRemaining?: number;
  questionsAnswered: number;
  correctAnswers: number;
  hintsUsed: number;
  estimatedScore?: number;
}

export interface AssessmentResult {
  assessmentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  accuracy: number;
  feedback: {
    overallPerformance: string;
    strengthAreas: string[];
    improvementAreas: string[];
    nextSteps: string[];
    detailedAnalysis: {
      topic: Topic;
      score: number;
      feedback: string;
    }[];
  };
  recommendations: string[];
}

// Event types for tracking and analytics
export type EventType = 
  | 'ASSESSMENT_STARTED'
  | 'QUESTION_ANSWERED'
  | 'ASSESSMENT_COMPLETED'
  | 'VALIDATION_FAILED'
  | 'ERROR_OCCURRED'
  | 'FEEDBACK_GENERATED'
  | 'PROGRESS_UPDATED';

export interface AssessmentEvent {
  type: EventType;
  timestamp: number;
  userId?: string;
  assessmentId: string;
  metadata?: Record<string, unknown>;
}

// Service interfaces
export interface ValidationService {
  validateQuestion(question: Question): Promise<ValidationResult>;
  validateAnswer(question: Question, answer: string): Promise<ValidationResult>;
  validateAssessment(assessment: Assessment): Promise<ValidationResult>;
}

export interface AssessmentService {
  createAssessment(config: AssessmentConfig): Promise<Assessment>;
  submitAnswer(assessmentId: string, questionId: string, answer: string): Promise<ValidationResult>;
  completeAssessment(assessmentId: string): Promise<AssessmentResult>;
  getProgress(assessmentId: string): Promise<AssessmentProgress>;
}

export interface AIService {
  generateQuestion(params: AIQuestionRequest): Promise<AIQuestionResponse>;
  validateResponse(question: Question, answer: string): Promise<ValidationResult>;
  generateFeedback(result: AssessmentResult): Promise<string>;
}

// Configuration types
export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  ai: {
    provider: 'openai' | 'anthropic' | 'cohere';
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  assessment: {
    maxQuestions: number;
    timeLimit: number;
    passingScore: number;
    adaptiveDifficulty: boolean;
    allowHints: boolean;
    showFeedback: boolean;
  };
  features: {
    enableAI: boolean;
    enableAdaptiveLearning: boolean;
    enableRealTimeValidation: boolean;
    enableDetailedFeedback: boolean;
  };
} 