export type ErrorCode = 
  | 'DATABASE_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CHECKPOINT_ERROR'
  | 'REMEDIAL_ERROR'
  | 'CONTENT_ERROR'
  | 'SYSTEM_ERROR';

export type ErrorContext = {
  code: ErrorCode;
  message: string;
  cause?: Error;
  metadata?: Record<string, any>;
};

export class CustomError extends Error {
  public readonly code: ErrorCode;
  public readonly metadata?: Record<string, any>;
  public readonly cause?: Error;

  constructor(code: ErrorCode, message: string, context?: Partial<ErrorContext>) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.cause = context?.cause;
    this.metadata = context?.metadata;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      metadata: this.metadata,
      stack: this.stack
    };
  }
}

export class ErrorHandler {
  static handle(error: unknown): never {
    if (error instanceof CustomError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new CustomError(
        'SYSTEM_ERROR',
        'An unexpected error occurred',
        { cause: error }
      );
    }

    throw new CustomError(
      'SYSTEM_ERROR',
      'An unknown error occurred',
      { metadata: { error } }
    );
  }

  static async handleAsync<T>(
    promise: Promise<T>,
    errorTransform?: (error: unknown) => CustomError
  ): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      if (errorTransform) {
        throw errorTransform(error);
      }
      throw this.handle(error);
    }
  }
} 