import { describe, expect, it, beforeEach, vi } from 'vitest';
import { rateLimitMiddleware } from '@/middleware/rate-limit';
import { NextRequest } from 'next/server';

describe('Rate Limiting Middleware', () => {
  beforeEach(() => {
    // Reset rate limit counters
    vi.clearAllMocks();
  });

  it('should allow requests within limit', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/api/test'));
    const response = await rateLimitMiddleware(request);
    
    expect(response.status).not.toBe(429);
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined();
  });

  it('should block excessive requests', async () => {
    const request = new NextRequest(new URL('http://localhost:3000/api/test'));
    
    // Make multiple requests
    const promises = Array(11).fill(null).map(() => rateLimitMiddleware(request));
    const responses = await Promise.all(promises);
    
    // At least one should be rate limited
    expect(responses.some(r => r.status === 429)).toBe(true);
  });
}); 