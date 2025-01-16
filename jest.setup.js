require('@testing-library/jest-dom');

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    $queryRaw: jest.fn(),
    assessment: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    masteryProgress: {
      upsert: jest.fn(),
    },
  })),
  Prisma: {
    sql: jest.fn((strings, ...values) => ({ strings, values })),
  },
}));

// Add any additional global test setup here
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
  }),
})); 