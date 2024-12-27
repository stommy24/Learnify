export class AssessmentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AssessmentError';
  }
}

export const AssessmentErrorCodes = {
  INVALID_ANSWER: 'INVALID_ANSWER',
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',
  SUBMISSION_FAILED: 'SUBMISSION_FAILED',
  SCORING_FAILED: 'SCORING_FAILED',
  TRACKING_FAILED: 'TRACKING_FAILED'
} as const;

export function handleAssessmentError(error: unknown) {
  if (error instanceof AssessmentError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    statusCode: 500
  };
} 