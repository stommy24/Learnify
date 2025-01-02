import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitMiddleware } from './middleware/rateLimiting';
import { errorMiddleware } from './middleware/error';
import { apiAuthMiddleware } from './middleware/api-auth';

export async function middleware(request: NextRequest) {
  return rateLimitMiddleware(request);
}

export const config = {
  matcher: '/api/placement/:path*'
}; 