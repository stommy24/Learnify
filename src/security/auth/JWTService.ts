import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../../utils/ErrorHandler';

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

export class JWTService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || '';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || '';
    this.accessTokenExpiry = '15m';  // 15 minutes
    this.refreshTokenExpiry = '7d';   // 7 days

    if (!this.accessTokenSecret || !this.refreshTokenSecret) {
      throw new Error('JWT secrets not configured');
    }
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }
} 