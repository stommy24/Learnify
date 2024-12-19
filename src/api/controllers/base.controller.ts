import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { ApiError } from '../errors/ApiError';

export abstract class BaseController {
  protected async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    handler: () => Promise<any>
  ) {
    try {
      const result = await handler();
      res.json(result);
    } catch (error) {
      logger.error('Request error:', error);
      next(error instanceof ApiError ? error : new ApiError('Internal server error', 500));
    }
  }
} 