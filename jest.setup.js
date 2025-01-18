require('dotenv').config({ path: '.env.test' });

import '@testing-library/jest-dom';
import 'jest-environment-jsdom';

// Mock Logtail
jest.mock('@logtail/node', () => ({
  Logtail: jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  })),
}));

// Mock Redis
jest.mock('ioredis', () => require('ioredis-mock'));