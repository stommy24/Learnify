import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/ErrorHandler';
import logger from '../utils/logger';

export abstract class BaseController {
  protected abstract executeImpl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any>;

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.executeImpl(req, res, next);
    } catch (error) {
      logger.error(`[BaseController]: Uncaught controller error`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        path: req.path,
        method: req.method,
      });
      next(error);
    }
  }

  protected ok<T>(res: Response, dto?: T) {
    if (dto) {
      return res.status(200).json(dto);
    }
    return res.sendStatus(200);
  }

  protected created<T>(res: Response, dto?: T) {
    if (dto) {
      return res.status(201).json(dto);
    }
    return res.sendStatus(201);
  }

  protected clientError(message?: string) {
    return new ValidationError(message || 'Bad request');
  }

  protected unauthorized(message?: string) {
    return new AppError(401, message || 'Unauthorized');
  }

  protected forbidden(message?: string) {
    return new AppError(403, message || 'Forbidden');
  }

  protected notFound(message?: string) {
    return new AppError(404, message || 'Not found');
  }
} 