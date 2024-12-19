import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function apiAuthMiddleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Add user info to request headers for API routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', token.id as string);
  requestHeaders.set('x-user-role', token.role as string);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
} 