import { logger } from '@/utils/logger';
import * as Sentry from '@sentry/nextjs';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public stack = ''
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export const handleError = (error: Error | AppError) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    isOperational: error instanceof AppError ? error.isOperational : false,
  });

  // Report to Sentry if it's not an operational error
  if (!(error instanceof AppError) || !error.isOperational) {
    Sentry.captureException(error);
  }
};

export const errorHandler = (err: Error, req: any, res: any, next: any) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Log and report unexpected errors
  handleError(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, true);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(403, message, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message, true);
  }
} 