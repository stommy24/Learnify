import '@testing-library/jest-dom';
import './mocks/prisma';
import './mocks/auth-adapter';

// Setup React
global.React = require('react');

// Mock Redis
jest.mock('@/lib/redis', () => ({
  redis: {
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn(),
  },
}));

// Mock environment variables for tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.REDIS_TOKEN = 'test-token';
process.env.OPENAI_API_KEY = 'test-key'; 