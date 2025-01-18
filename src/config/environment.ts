import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  REDIS_URL: z.string(),
  REDIS_TOKEN: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error(
    'Invalid environment configuration:',
    JSON.stringify(envParsed.error.format(), null, 2)
  );
  
  // Only throw in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Invalid environment configuration');
  }
}

export const env = envParsed.success ? envParsed.data : {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'test-secret',
  OPENAI_API_KEY: 'test-key',
  REDIS_URL: 'redis://localhost:6379',
  REDIS_TOKEN: 'test-token',
  NODE_ENV: 'test'
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 15000,
  },
  database: {
    url: process.env.DATABASE_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
  },
  redis: {
    url: process.env.REDIS_URL,
    ttl: parseInt(process.env.REDIS_CACHE_TTL || '3600'),
  },
  auth: {
    secret: process.env.AUTH_SECRET,
    tokenExpiry: '24h',
    refreshTokenExpiry: '7d',
  },
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    datadog: {
      apiKey: process.env.DD_API_KEY,
      appKey: process.env.DD_APP_KEY,
    },
  },
  cache: {
    defaultTTL: 3600,
  },
  security: {
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
      credentials: true,
    },
  },
}; 