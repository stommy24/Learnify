import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function errorMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
) {
  try {
    return await next();
  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode }
      );
    }

    // Default error response
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
} 