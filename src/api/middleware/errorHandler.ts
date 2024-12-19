import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { ValidationError } from '../errors/ValidationError';
import { logger } from '../../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.errors
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}; 