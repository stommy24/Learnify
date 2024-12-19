export class AssessmentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AssessmentError';
  }
}

export class CurriculumParseError extends AssessmentError {
  constructor(message: string, details?: any) {
    super(message, 'CURRICULUM_PARSE_ERROR', details);
  }
}

export class QuestionGenerationError extends AssessmentError {
  constructor(message: string, details?: any) {
    super(message, 'QUESTION_GENERATION_ERROR', details);
  }
}

export class ValidationError extends AssessmentError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

export class AdaptationError extends AssessmentError {
  constructor(message: string, details?: any) {
    super(message, 'ADAPTATION_ERROR', details);
  }
}

export function handleAssessmentError(error: Error): {
  message: string;
  code: string;
  status: number;
} {
  if (error instanceof AssessmentError) {
    return {
      message: error.message,
      code: error.code,
      status: getStatusCode(error.code)
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    status: 500
  };
}

function getStatusCode(errorCode: string): number {
  switch (errorCode) {
    case 'CURRICULUM_PARSE_ERROR':
      return 500;
    case 'QUESTION_GENERATION_ERROR':
      return 422;
    case 'VALIDATION_ERROR':
      return 400;
    case 'ADAPTATION_ERROR':
      return 422;
    default:
      return 500;
  }
} 