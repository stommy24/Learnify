import { z } from 'zod';

// Create a test schema that matches your production schema
const testEnvSchema = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string(),
  REDIS_URL: z.string(),
  OPENAI_API_KEY: z.string(),
  REDIS_TOKEN: z.string(),
  NODE_ENV: z.string()
});

export const testEnv = testEnvSchema.parse({
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  NEXTAUTH_SECRET: 'test-secret',
  NEXTAUTH_URL: 'http://localhost:3000',
  REDIS_URL: 'redis://localhost:6379',
  OPENAI_API_KEY: 'test-key',
  REDIS_TOKEN: 'test-token',
  NODE_ENV: 'test'
});

// Add a test to satisfy Jest
describe('Environment Configuration', () => {
  it('should have valid test environment variables', () => {
    expect(testEnv).toBeDefined();
  });
});

// Mock the environment module
jest.mock('@/config/environment', () => ({
  env: testEnv
})); 