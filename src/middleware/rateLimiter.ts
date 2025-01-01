import { NextRequest, NextResponse } from 'next/server';

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

interface RateLimitWindow {
  timestamp: number;
  count: number;
}

const windows = new Map<string, RateLimitWindow>();

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const windowData = windows.get(ip) || { timestamp: now, count: 0 };

  // Reset window if it's expired
  if (now - windowData.timestamp > WINDOW_SIZE) {
    windowData.timestamp = now;
    windowData.count = 0;
  }

  // Increment request count
  windowData.count++;
  windows.set(ip, windowData);

  // Check if rate limit exceeded
  if (windowData.count > MAX_REQUESTS) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  return undefined;
} 