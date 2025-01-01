import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { env } from '@/config/environment';

// Create Redis instance directly in the middleware file
const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN
});

export async function rateLimitMiddleware(request: NextRequest) {
  try {
    const ip = request.headers.get('X-Forwarded-For')?.split(',')[0] || request.ip;
    
    if (!ip) {
      return new NextResponse(null, {
        status: 400,
        statusText: 'Missing IP Address'
      });
    }

    const key = `rate-limit:${ip}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, 60);
    }

    if (current > 100) {
      return new NextResponse(null, {
        status: 429,
        statusText: 'Too Many Requests'
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Rate limit error:', error);
    return NextResponse.error();
  }
} 