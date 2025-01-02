import { Redis } from 'ioredis';
import { logger } from '@/lib/monitoring';

interface CachedImage {
  url: string;
  hash: string;
  metadata: {
    subject: 'math' | 'english';
    type: 'diagram' | 'graph' | 'illustration';
    topic: string;
    generatedAt: string;
  };
}

export class ImageCacheService {
  private redis: Redis;
  private readonly TTL = 7 * 24 * 60 * 60; // 7 days

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || '');
  }

  async cacheImage(
    imageHash: string,
    imageData: CachedImage
  ): Promise<void> {
    try {
      const key = this.generateCacheKey(imageHash);
      await this.redis.setex(
        key,
        this.TTL,
        JSON.stringify(imageData)
      );

      // Cache by topic for quick retrieval
      const topicKey = this.generateTopicKey(
        imageData.metadata.subject,
        imageData.metadata.topic
      );
      await this.redis.sadd(topicKey, imageHash);
      await this.redis.expire(topicKey, this.TTL);
    } catch (error) {
      logger.error('Failed to cache image', {
        imageHash,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCachedImage(
    subject: 'math' | 'english',
    topic: string,
    type: 'diagram' | 'graph' | 'illustration'
  ): Promise<CachedImage | null> {
    try {
      const topicKey = this.generateTopicKey(subject, topic);
      const imageHashes = await this.redis.smembers(topicKey);

      for (const hash of imageHashes) {
        const imageData = await this.redis.get(
          this.generateCacheKey(hash)
        );
        
        if (imageData) {
          const parsed = JSON.parse(imageData) as CachedImage;
          if (parsed.metadata.type === type) {
            return parsed;
          }
        }
      }

      return null;
    } catch (error) {
      logger.error('Failed to retrieve cached image', {
        subject,
        topic,
        type,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private generateCacheKey(hash: string): string {
    return `image:${hash}`;
  }

  private generateTopicKey(
    subject: string,
    topic: string
  ): string {
    return `topic:${subject}:${topic}`;
  }

  async invalidateCache(
    subject: 'math' | 'english',
    topic?: string
  ): Promise<void> {
    try {
      if (topic) {
        const topicKey = this.generateTopicKey(subject, topic);
        const imageHashes = await this.redis.smembers(topicKey);
        
        // Delete individual images
        const pipeline = this.redis.pipeline();
        imageHashes.forEach(hash => {
          pipeline.del(this.generateCacheKey(hash));
        });
        
        // Delete topic set
        pipeline.del(topicKey);
        await pipeline.exec();
      } else {
        // Delete all images for the subject
        const pattern = `topic:${subject}:*`;
        const keys = await this.redis.keys(pattern);
        
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }
    } catch (error) {
      logger.error('Failed to invalidate cache', {
        subject,
        topic,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 