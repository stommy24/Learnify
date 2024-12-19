import { ValidationResult } from '../types';

export interface ErrorDetails {
  code: string;
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

export class ErrorBoundary {
  private static instance: ErrorBoundary;
  private readonly fallbackResponses: Map<string, unknown>;
  private readonly errorLog: ErrorDetails[] = [];
  private readonly maxLogSize = 100;

  private constructor() {
    this.fallbackResponses = new Map();
    this.initializeFallbacks();
  }

  static getInstance(): ErrorBoundary {
    if (!ErrorBoundary.instance) {
      ErrorBoundary.instance = new ErrorBoundary();
    }
    return ErrorBoundary.instance;
  }

  private initializeFallbacks(): void {
    // Default fallback responses for different scenarios
    this.fallbackResponses.set('AI_GENERATION_FAILED', {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      explanation: 'Basic addition',
      metadata: {
        difficulty: 1,
        yearGroup: 1,
        term: 1
      }
    });

    this.fallbackResponses.set('CURRICULUM_LOAD_FAILED', {
      objectives: ['Basic numeracy', 'Basic literacy'],
      keywords: ['number', 'word'],
      expectedOutcomes: ['Basic understanding']
    });
  }

  async handleError<T>(
    operation: () => Promise<T>,
    errorCode: string,
    context?: Record<string, unknown>
  ): Promise<ValidationResult & { data?: T }> {
    try {
      const result = await operation();
      return {
        isValid: true,
        errors: [],
        warnings: [],
        data: result
      };
    } catch (error) {
      this.logError({
        code: errorCode,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        context
      });

      const fallback = this.fallbackResponses.get(errorCode);
      return {
        isValid: false,
        errors: [`Operation failed: ${errorCode}`],
        warnings: ['Using fallback response'],
        data: fallback as T
      };
    }
  }

  private logError(error: ErrorDetails): void {
    this.errorLog.unshift(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.pop();
    }
    this.notifyError(error);
  }

  private notifyError(error: ErrorDetails): void {
    // In production, this would send to error monitoring service
    console.error('Error occurred:', {
      code: error.code,
      message: error.message,
      timestamp: new Date(error.timestamp).toISOString(),
      context: error.context
    });
  }

  getRecentErrors(): ErrorDetails[] {
    return [...this.errorLog];
  }
} 