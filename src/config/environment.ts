import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  // Add other environment variables here
});

const envParsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Add other environment variables here
});

if (!envParsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(envParsed.error.format(), null, 2)
  );
  process.exit(1);
}

export const env = envParsed.data;

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