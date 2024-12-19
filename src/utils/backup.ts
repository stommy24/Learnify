import { exec } from 'child_process';
import { uploadToS3 } from './s3';

export const backupDatabase = async () => {
  const timestamp = new Date().toISOString();
  const filename = `backup-${timestamp}.sql`;
  
  try {
    // Create backup
    await new Promise((resolve, reject) => {
      exec(
        `pg_dump ${process.env.DATABASE_URL} > ${filename}`,
        (error, stdout, stderr) => {
          if (error) reject(error);
          else resolve(stdout);
        }
      );
    });

    // Upload to S3
    await uploadToS3(filename, `backups/${filename}`);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}; 