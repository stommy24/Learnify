import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.updateMany({
      data: {
        preferences: {
          theme: 'light',
          emailNotifications: true,
          pushNotifications: true,
          language: 'en'
        }
      }
    });

    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main(); 