import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 30;

export async function rateLimitMiddleware(
  request: NextRequest,
  matcher: RegExp = /^\/api\/placement\//
) {
  if (!matcher.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const ip = request.ip ?? '127.0.0.1';
  const key = `ratelimit:${ip}`;

  const result = await redis
    .multi()
    .incr(key)
    .expire(key, WINDOW_SIZE_IN_SECONDS)
    .exec();

  const requests = result?.[0]?.[1] as number || 0;
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - requests);

  const response = NextResponse.next();

  response.headers.set('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());

  if (requests > MAX_REQUESTS_PER_WINDOW) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Please try again later'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
          'X-RateLimit-Remaining': '0',
          'Retry-After': WINDOW_SIZE_IN_SECONDS.toString()
        }
      }
    );
  }

  return response;
} 