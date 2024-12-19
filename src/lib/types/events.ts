import { 
  Question,
  QuizResult,
  ValidationResult,
  AssessmentConfig 
} from '@/lib/types';

export type EventType = 
  | 'ASSESSMENT_STARTED'
  | 'QUESTION_ANSWERED'
  | 'ASSESSMENT_COMPLETED'
  | 'VALIDATION_FAILED'
  | 'ERROR_OCCURRED'
  | 'FEEDBACK_GENERATED'
  | 'PROGRESS_UPDATED';

export interface BaseEvent {
  type: EventType;
  timestamp: number;
  userId?: string;
}

export interface AssessmentStartedEvent extends BaseEvent {
  type: 'ASSESSMENT_STARTED';
  config: AssessmentConfig;
  assessmentId: string;
}

export interface QuestionAnsweredEvent extends BaseEvent {
  type: 'QUESTION_ANSWERED';
  assessmentId: string;
  questionId: string;
  answer: string;
  result: ValidationResult;
  timeTaken: number;
}

export interface AssessmentCompletedEvent extends BaseEvent {
  type: 'ASSESSMENT_COMPLETED';
  assessmentId: string;
  result: QuizResult;
  totalTime: number;
}

export interface ValidationFailedEvent extends BaseEvent {
  type: 'VALIDATION_FAILED';
  context: string;
  errors: string[];
  metadata?: Record<string, unknown>;
}

export interface ErrorEvent extends BaseEvent {
  type: 'ERROR_OCCURRED';
  error: Error;
  context: string;
  metadata?: Record<string, unknown>;
}

export interface FeedbackEvent extends BaseEvent {
  type: 'FEEDBACK_GENERATED';
  assessmentId: string;
  feedback: string;
  recommendations: string[];
}

export interface ProgressEvent extends BaseEvent {
  type: 'PROGRESS_UPDATED';
  assessmentId: string;
  progress: number;
  currentQuestion: Question;
}

export type AssessmentEvent = 
  | AssessmentStartedEvent
  | QuestionAnsweredEvent
  | AssessmentCompletedEvent
  | ValidationFailedEvent
  | ErrorEvent
  | FeedbackEvent
  | ProgressEvent; 