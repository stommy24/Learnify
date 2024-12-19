export class GenerationError extends Error {
  constructor(
    public code: GenerationErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GenerationError';
  }
}

export enum GenerationErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  MODEL_ERROR = 'MODEL_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TIMEOUT = 'TIMEOUT',
  INVALID_REQUEST = 'INVALID_REQUEST'
}

export class GenerationErrorHandler {
  static handle(error: any): never {
    if (error instanceof GenerationError) {
      logger.error('Generation Error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      throw error;
    }

    if (error.response?.status === 429) {
      throw new GenerationError(
        GenerationErrorCode.RATE_LIMIT_EXCEEDED,
        'Rate limit exceeded'
      );
    }

    logger.error('Unexpected Generation Error:', error);
    throw new GenerationError(
      GenerationErrorCode.MODEL_ERROR,
      'An unexpected error occurred during question generation'
    );
  }
} 