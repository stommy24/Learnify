import { checkEnvironmentVariables } from './checks/env';
import { checkDatabaseConnection } from './checks/database';
import { checkRedisConnection } from './checks/redis';
import { checkS3Access } from './checks/storage';
import { checkSecurityHeaders } from './checks/security';
import { logger } from '@/lib/logger';

export async function runProductionChecks() {
  try {
    // Check all required environment variables
    await checkEnvironmentVariables([
      'DATABASE_URL',
      'REDIS_URL',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'SENTRY_DSN',
      'SMTP_HOST',
      'SMTP_USER',
      'SMTP_PASSWORD'
    ]);

    // Check critical service connections
    await Promise.all([
      checkDatabaseConnection(),
      checkRedisConnection(),
      checkS3Access(),
    ]);

    // Verify security configurations
    await checkSecurityHeaders();

    logger.info('All production checks passed successfully');
    return true;
  } catch (error) {
    logger.error('Production checks failed:', error);
    return false;
  }
} 