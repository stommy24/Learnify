import { Redis } from 'ioredis';
import { TokenPayload } from '../auth/JWTService';

export class SessionService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });
  }

  async createSession(userId: string, payload: TokenPayload): Promise<void> {
    const sessionKey = `session:${userId}`;
    await this.redis.setex(
      sessionKey,
      7 * 24 * 60 * 60, // 7 days
      JSON.stringify(payload)
    );
  }

  async getSession(userId: string): Promise<TokenPayload | null> {
    const session = await this.redis.get(`session:${userId}`);
    return session ? JSON.parse(session) : null;
  }

  async invalidateSession(userId: string): Promise<void> {
    await this.redis.del(`session:${userId}`);
  }

  async invalidateAllSessions(userId: string): Promise<void> {
    const sessionPattern = `session:${userId}:*`;
    const keys = await this.redis.keys(sessionPattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
} 