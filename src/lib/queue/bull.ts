import Bull from 'bull';
import { logger } from '@/lib/logger';

export const emailQueue = new Bull('email-queue', process.env.REDIS_URL as string);
export const analyticsQueue = new Bull('analytics-queue', process.env.REDIS_URL as string);

emailQueue.process(async (job) => {
  try {
    const { to, subject, content } = job.data;
    // Email sending logic here
    logger.info('Email sent successfully', { to, subject });
  } catch (error) {
    logger.error('Email job failed:', error);
    throw error;
  }
});

analyticsQueue.process(async (job) => {
  try {
    const { event, userId, metadata } = job.data;
    // Analytics processing logic here
    logger.info('Analytics event processed', { event, userId });
  } catch (error) {
    logger.error('Analytics job failed:', error);
    throw error;
  }
}); 