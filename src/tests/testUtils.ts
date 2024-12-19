import { vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'vitest-mock-extended';

export const createMockPrismaClient = () => mockDeep<PrismaClient>();

export const createMockLogger = () => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn()
}); 