import { QuestionGenerator } from './generation/QuestionGenerator';
import { TemplateManager } from './templates/TemplateManager';
import { QuestionValidator } from './validation/QuestionValidator';
import { redisService } from '@/lib/cache/redis';
import { logger } from '@/utils/logger';
import { performanceMonitor } from '@/lib/monitoring/performance';
import { 
  Question,
  CurriculumMapping,
  DifficultyLevel,
  GenerationRequest,
  GenerationStatus
} from './types';
import Bull from 'bull';

export class QuestionGenerationOrchestrator {
  private generator: QuestionGenerator;
  private templateManager: TemplateManager;
  private validator: QuestionValidator;
  private generationQueue: Bull.Queue;

  constructor() {
    this.generator = new QuestionGenerator();
    this.templateManager = new TemplateManager();
    this.validator = new QuestionValidator();
    
    this.generationQueue = new Bull('question-generation', {
      redis: process.env.REDIS_URL,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }
    });

    this.setupQueueHandlers();
  }

  async generateQuestions(request: GenerationRequest): Promise<string> {
    const requestId = this.generateRequestId();
    
    try {
      // Check cache first
      const cached = await this.checkCache(request);
      if (cached) {
        logger.info('Returning cached questions', { requestId });
        return cached;
      }

      // Add to queue
      await this.generationQueue.add({
        requestId,
        request,
        timestamp: Date.now()
      });

      // Store initial status
      await this.updateGenerationStatus(requestId, {
        status: 'queued',
        progress: 0,
        timestamp: new Date().toISOString()
      });

      return requestId;

    } catch (error) {
      logger.error('Failed to queue question generation', {
        requestId,
        error
      });
      throw new Error('Failed to initiate question generation');
    }
  }

  async getGenerationStatus(requestId: string): Promise<GenerationStatus> {
    const status = await redisService.get(`generation_status:${requestId}`);
    return status || { status: 'not_found' };
  }

  private async checkCache(request: GenerationRequest): Promise<string | null> {
    const cacheKey = this.generateCacheKey(request);
    return redisService.get(cacheKey);
  }

  private async updateGenerationStatus(
    requestId: string,
    status: GenerationStatus
  ): Promise<void> {
    await redisService.set(
      `generation_status:${requestId}`,
      status,
      60 * 60 // 1 hour TTL
    );
  }

  private setupQueueHandlers(): void {
    this.generationQueue.process(async (job) => {
      const { requestId, request } = job.data;
      const endTimer = performanceMonitor.startTimer(`question_generation:${requestId}`);

      try {
        const questions = await this.processGenerationRequest(requestId, request);
        
        // Cache results
        const cacheKey = this.generateCacheKey(request);
        await redisService.set(cacheKey, questions, 60 * 60 * 24); // 24 hour TTL

        await this.updateGenerationStatus(requestId, {
          status: 'completed',
          progress: 100,
          result: questions,
          timestamp: new Date().toISOString()
        });

        endTimer();
        return questions;

      } catch (error) {
        logger.error('Question generation failed', {
          requestId,
          error
        });

        await this.updateGenerationStatus(requestId, {
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });

        endTimer();
        throw error;
      }
    });

    this.generationQueue.on('failed', (job, error) => {
      logger.error('Question generation job failed', {
        jobId: job.id,
        requestId: job.data.requestId,
        error
      });
    });
  }

  private async processGenerationRequest(
    requestId: string,
    request: GenerationRequest
  ): Promise<Question[]> {
    const questions: Question[] = [];
    const totalQuestions = request.count || 1;

    for (let i = 0; i < totalQuestions; i++) {
      const question = await this.generator.generateQuestion({
        curriculum: request.curriculum,
        difficulty: request.difficulty,
        excludeIds: questions.map(q => q.id)
      });

      questions.push(question);

      // Update progress
      await this.updateGenerationStatus(requestId, {
        status: 'in_progress',
        progress: Math.round(((i + 1) / totalQuestions) * 100),
        timestamp: new Date().toISOString()
      });
    }

    return questions;
  }

  private generateRequestId(): string {
    return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(request: GenerationRequest): string {
    return `questions:${JSON.stringify(request)}`;
  }
} 