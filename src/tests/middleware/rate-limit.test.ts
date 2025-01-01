// Mock environment variables first
jest.mock('@/config/environment', () => ({
  env: {
    REDIS_URL: 'https://fake-redis-url',
    REDIS_TOKEN: 'fake-token'
  }
}));

// Mock Redis constructor with inline mock functions
jest.mock('@upstash/redis', () => {
  const mockFunctions = {
    incr: jest.fn(),
    expire: jest.fn()
  };

  return {
    Redis: jest.fn().mockImplementation(() => mockFunctions),
    _getMockFunctions: () => mockFunctions
  };
});

// Now import the middleware that uses Redis
import { rateLimitMiddleware } from '@/middleware/rate-limit';
import { NextResponse } from 'next/server';

interface MockResponseInit {
  status?: number;
  statusText?: string;
}

// Mock Next.js server
jest.mock('next/server', () => {
  class MockNextResponse {
    public status: number;
    public statusText?: string;
    public body: any;

    constructor(body: any, init?: MockResponseInit) {
      this.status = init?.status || 200;
      this.statusText = init?.statusText;
      this.body = body;
    }

    static json(body: any, init?: MockResponseInit) {
      return new MockNextResponse(body, init);
    }

    static next() {
      return new MockNextResponse(null, { status: 200 });
    }

    static error() {
      return new MockNextResponse(null, { status: 500 });
    }
  }

  class MockHeaders {
    private headers: Map<string, string>;

    constructor(init?: Record<string, string>) {
      this.headers = new Map(Object.entries(init || {}));
    }

    get(key: string): string | null {
      return this.headers.get(key) || null;
    }
  }

  return {
    NextRequest: jest.fn().mockImplementation((url: string, init?: { headers?: Record<string, string> }) => ({
      ip: '127.0.0.1',
      url,
      headers: new MockHeaders(init?.headers)
    })),
    NextResponse: MockNextResponse
  };
});

describe('Rate Limiting Middleware', () => {
  let mockIncr: jest.Mock;
  let mockExpire: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Get the mock functions from the Redis mock
    const mockFunctions = jest.requireMock('@upstash/redis')._getMockFunctions();
    mockIncr = mockFunctions.incr;
    mockExpire = mockFunctions.expire;
    
    mockIncr.mockReset();
    mockExpire.mockReset();

    // Spy on console.error but suppress output
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('blocks requests exceeding rate limit', async () => {
    mockIncr.mockResolvedValue(101); // Exceed rate limit
    mockExpire.mockResolvedValue(true);
    
    const mockRequest = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000');
    const response = await rateLimitMiddleware(mockRequest);
    
    expect(response.status).toBe(429);
    expect(response.statusText).toBe('Too Many Requests');
  });

  test('allows requests within rate limit', async () => {
    mockIncr.mockResolvedValue(5); // Within rate limit
    mockExpire.mockResolvedValue(true);
    
    const mockRequest = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000');
    const response = await rateLimitMiddleware(mockRequest);
    
    expect(response.status).toBe(200);
  });

  test('sets expiry on first request', async () => {
    mockIncr.mockResolvedValue(1); // First request
    mockExpire.mockResolvedValue(true);
    
    const mockRequest = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000');
    await rateLimitMiddleware(mockRequest);
    
    expect(mockExpire).toHaveBeenCalledWith('rate-limit:127.0.0.1', 60);
  });

  test('handles Redis connection errors gracefully', async () => {
    const error = new Error('Redis connection failed');
    mockIncr.mockRejectedValue(error);
    
    const mockRequest = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000');
    const response = await rateLimitMiddleware(mockRequest);
    
    expect(response.status).toBe(500);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Rate limit error:', error);
  });

  test('extracts IP from X-Forwarded-For header', async () => {
    mockIncr.mockResolvedValue(1);
    mockExpire.mockResolvedValue(true);
    
    const mockRequest = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000', {
      headers: {
        'X-Forwarded-For': '1.2.3.4'
      }
    });
    
    await rateLimitMiddleware(mockRequest);
    expect(mockIncr).toHaveBeenCalledWith('rate-limit:1.2.3.4');
  });

  test('handles zero rate limit values', async () => {
    mockIncr.mockResolvedValue(0);
    mockExpire.mockResolvedValue(true);
    
    const mockRequest = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000');
    const response = await rateLimitMiddleware(mockRequest);
    
    expect(response.status).toBe(200);
  });

  test('handles Redis expire failures', async () => {
    mockIncr.mockResolvedValue(1);
    const error = new Error('Expire failed');
    mockExpire.mockRejectedValue(error);
    
    const mockRequest = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000');
    const response = await rateLimitMiddleware(mockRequest);
    
    expect(response.status).toBe(500);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Rate limit error:', error);
  });

  test('handles missing IP address', async () => {
    mockIncr.mockResolvedValue(1);
    mockExpire.mockResolvedValue(true);
    
    const mockRequest = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000');
    // @ts-ignore - Deliberately removing IP to test edge case
    mockRequest.ip = undefined;
    
    const response = await rateLimitMiddleware(mockRequest);
    expect(response.status).toBe(400);
  });
});