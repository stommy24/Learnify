import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/auth/AuthService';
import { BaseController } from './base.controller';

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const { email, password } = req.body;
      return this.authService.login({ email, password });
    });
  };

  // ... other auth methods
} 