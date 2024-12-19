import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

export class CSRFService {
  private readonly tokenLength = 32;

  generateToken(): string {
    return randomBytes(this.tokenLength).toString('hex');
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (this.shouldCheckCSRF(req)) {
        const requestToken = req.headers['x-csrf-token'];
        const sessionToken = req.session.csrfToken;

        if (!requestToken || !sessionToken || requestToken !== sessionToken) {
          return res.status(403).json({ error: 'Invalid CSRF token' });
        }
      }

      // Generate new token for next request
      const newToken = this.generateToken();
      req.session.csrfToken = newToken;
      res.setHeader('X-CSRF-Token', newToken);

      next();
    };
  }

  private shouldCheckCSRF(req: Request): boolean {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    return !safeMethods.includes(req.method);
  }
} 