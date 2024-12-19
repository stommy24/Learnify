import { S3 } from 'aws-sdk';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function backupDatabase() {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  try {
    // Dump database
    const timestamp = new Date().toISOString();
    const backup = await prisma.$queryRaw`pg_dump $DATABASE_URL`;

    // Upload to S3
    await s3.putObject({
      Bucket: process.env.BACKUP_BUCKET_NAME!,
      Key: `backups/${timestamp}.sql`,
      Body: backup,
      ServerSideEncryption: 'AES256',
    }).promise();

    logger.info('Database backup completed successfully');
  } catch (error) {
    logger.error('Database backup failed:', error);
    throw error;
  }
} 