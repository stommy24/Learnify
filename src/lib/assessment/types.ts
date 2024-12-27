export type AssessmentError = 
  | 'INVALID_QUESTION'
  | 'INVALID_ANSWER'
  | 'TIMEOUT'
  | 'SYSTEM_ERROR'
  | 'VALIDATION_ERROR';

export class AssessmentException extends Error {
  constructor(
    public type: AssessmentError,
    public details: string,
    public metadata?: Record<string, any>
  ) {
    super(`Assessment Error (${type}): ${details}`);
  }
} 