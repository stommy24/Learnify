import winston from 'winston';
import { Format } from 'logform';

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: this.getLogFormat(),
      transports: this.getTransports(),
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogFormat(): Format {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );
  }

  private getTransports(): winston.transport[] {
    const transports: winston.transport[] = [
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error' 
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log' 
      })
    ];

    if (process.env.NODE_ENV !== 'production') {
      transports.push(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }

    return transports;
  }

  logQuestionGeneration(params: {
    topicId: string;
    objectiveId: string;
    level: number;
    style: string;
    duration: number;
    success: boolean;
    error?: Error;
  }) {
    this.logger.info('Question Generation', {
      event: 'question_generation',
      ...params
    });
  }

  logScaffolding(params: {
    questionId: string;
    hintsProvided: number;
    mistakesAddressed: string[];
    duration: number;
  }) {
    this.logger.info('Scaffolding Generation', {
      event: 'scaffolding_generation',
      ...params
    });
  }

  logPerformance(params: {
    operation: string;
    duration: number;
    cacheHit?: boolean;
    resourceUsage?: NodeJS.ResourceUsage;
  }) {
    this.logger.info('Performance Metric', {
      event: 'performance',
      ...params,
      timestamp: new Date().toISOString()
    });
  }

  logError(error: Error, context?: any) {
    this.logger.error('Error Occurred', {
      event: 'error',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    });
  }

  info(message: string, meta?: any): void {
    // Implementation
  }
  
  error(message: string, error: Error): void {
    // Implementation
  }
} 