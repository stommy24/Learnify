import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from '../../config/environment';

export const securityConfig = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: env.API_RATE_LIMIT,
  }),
}; 