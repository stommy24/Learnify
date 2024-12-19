interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export class RetryMechanism {
  private static instance: RetryMechanism;
  private readonly defaultConfig: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000,    // 10 seconds
    backoffFactor: 2
  };

  private constructor() {}

  static getInstance(): RetryMechanism {
    if (!RetryMechanism.instance) {
      RetryMechanism.instance = new RetryMechanism();
    }
    return RetryMechanism.instance;
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    let lastError: Error | unknown;
    let delay = finalConfig.initialDelay;

    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === finalConfig.maxAttempts) {
          break;
        }

        await this.delay(delay);
        delay = Math.min(delay * finalConfig.backoffFactor, finalConfig.maxDelay);
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 