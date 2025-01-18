export const mockEnv = {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'test-secret',
  OPENAI_API_KEY: 'test-key',
  REDIS_URL: 'redis://localhost:6379',
  REDIS_TOKEN: 'test-token',
  NODE_ENV: 'test'
};

// Mock the environment module
jest.mock('@/config/environment', () => ({
  env: mockEnv
})); 