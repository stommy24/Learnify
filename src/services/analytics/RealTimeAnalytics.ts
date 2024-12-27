import { CacheManager } from '@/lib/cache/CacheManager';
import type { ScoreCard } from '@/types/assessment';

export class RealTimeAnalytics {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager();
  }

  async updateStats(scoreCard: ScoreCard): Promise<void> {
    await this.cache.set(`stats:${scoreCard.userId}`, scoreCard);
  }

  async clearCache(userId: string): Promise<void> {
    await this.cache.delete(`stats:${userId}`);
  }
} 