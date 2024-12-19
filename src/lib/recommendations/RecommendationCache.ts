interface CachedRecommendation {
  recommendations: any[];
  explanations: Record<string, string>;
  confidence: Record<string, number>;
  timestamp: Date;
}

export class RecommendationCache {
  private static instance: RecommendationCache;
  private cache: Map<string, CachedRecommendation> = new Map();
  private preloadQueue: string[] = [];
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 100;

  private constructor() {
    this.startPreloadWorker();
  }

  static getInstance(): RecommendationCache {
    if (!RecommendationCache.instance) {
      RecommendationCache.instance = new RecommendationCache();
    }
    return RecommendationCache.instance;
  }

  async get(userId: string): Promise<CachedRecommendation | null> {
    const cached = this.cache.get(userId);
    
    if (cached && this.isCacheValid(cached)) {
      return cached;
    }

    return null;
  }

  async set(
    userId: string,
    recommendations: CachedRecommendation
  ): Promise<void> {
    this.cache.set(userId, {
      ...recommendations,
      timestamp: new Date()
    });

    // Cleanup if cache is too large
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      this.cleanup();
    }
  }

  async preload(userId: string): Promise<void> {
    if (!this.preloadQueue.includes(userId)) {
      this.preloadQueue.push(userId);
    }
  }

  private isCacheValid(cached: CachedRecommendation): boolean {
    return (
      Date.now() - cached.timestamp.getTime() < this.CACHE_DURATION
    );
  }

  private cleanup(): void {
    const sortedEntries = Array.from(this.cache.entries())
      .sort((a, b) => b[1].timestamp.getTime() - a[1].timestamp.getTime());

    // Keep only the most recent entries
    this.cache = new Map(sortedEntries.slice(0, this.MAX_CACHE_SIZE));
  }

  private async startPreloadWorker(): Promise<void> {
    setInterval(async () => {
      if (this.preloadQueue.length === 0) return;

      const userId = this.preloadQueue.shift()!;
      try {
        // Fetch and cache recommendations
        const recommendations = await this.fetchRecommendations(userId);
        await this.set(userId, recommendations);
      } catch (error) {
        console.error('Failed to preload recommendations:', error);
      }
    }, 1000); // Run every second
  }

  private async fetchRecommendations(
    userId: string
  ): Promise<CachedRecommendation> {
    // Implement actual recommendation fetching
    return {
      recommendations: [],
      explanations: {},
      confidence: {},
      timestamp: new Date()
    };
  }
}

export const useRecommendationCache = () => {
  const cache = RecommendationCache.getInstance();
  return {
    getRecommendations: cache.get.bind(cache),
    cacheRecommendations: cache.set.bind(cache),
    preloadRecommendations: cache.preload.bind(cache)
  };
}; 