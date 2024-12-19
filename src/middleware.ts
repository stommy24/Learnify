import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitMiddleware } from './middleware/rate-limit';
import { errorMiddleware } from './middleware/error';
import { apiAuthMiddleware } from './middleware/api-auth';

export async function middleware(request: NextRequest) {
  // Skip middleware for non-API routes and public files
  if (
    !request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  try {
    // Apply rate limiting
    const rateLimit = await rateLimitMiddleware(request);
    if (rateLimit.status === 429) return rateLimit;

    // Apply authentication
    const auth = await apiAuthMiddleware(request);
    if (auth.status === 401) return auth;

    return NextResponse.next();
  } catch (error) {
    // Handle any errors
    return errorMiddleware(request, async () => {
      throw error;
    });
  }
}

export const config = {
  matcher: '/api/:path*',
}; 