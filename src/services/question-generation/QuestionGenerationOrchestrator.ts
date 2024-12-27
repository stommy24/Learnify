import Redis from 'ioredis';
import Queue from 'bull';
import type { Redis as RedisType } from 'ioredis';
import type { Queue as QueueType } from 'bull';
import { OpenAI } from 'openai';
import { QuestionGenerationEngine } from './QuestionGenerationEngine';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import type { 
  GenerationRequest, 
  GenerationStatus, 
  Question,
  CurriculumMapping,
  DifficultyLevel 
} from '@/types/generation';
import type { GeneratedQuestion } from './types';

interface GenerationJobData {
  requestId: string;
  request: GenerationRequest;
}

export class QuestionGenerationOrchestrator {
  private redis: RedisType;
  private queue: QueueType;
  private engine: QuestionGenerationEngine;
  private openai: OpenAI;

  constructor(redisUrl?: string, queueName?: string) {
    this.redis = new Redis(redisUrl);
    this.queue = new Queue(queueName || 'question-generation', {
      redis: redisUrl
    });
    this.engine = new QuestionGenerationEngine();
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    this.setupQueueHandlers();
  }

  async generateQuestions(request: GenerationRequest): Promise<string> {
    const requestId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store request in Redis with initial progress
    await this.redis.set(
      `request:${requestId}`,
      JSON.stringify({
        status: 'pending',
        progress: 0,
        totalQuestions: request.count || 1,
        generatedQuestions: [],
        errors: []
      } as GenerationStatus),
      'EX',
      3600
    );

    // Add to processing queue
    await this.queue.add(requestId, {
      requestId,
      request
    });

    return requestId;
  }

  private setupQueueHandlers() {
    this.queue.process(async (job: { data: { requestId: string; request: GenerationRequest } }) => {
      const { requestId, request } = job.data;

      try {
        const questions: Question[] = [];
        const errors: string[] = [];

        for (let i = 0; i < (request.count || 1); i++) {
          try {
            const question = await this.generateQuestion(
              request.curriculum,
              request.difficulty,
              questions.map(q => q.id)
            );

            questions.push(question);

            await this.updateProgress(requestId, {
              status: 'processing',
              generatedQuestions: questions,
              errors
            });

          } catch (err) {
            const error = err as Error;
            logger.error('Question generation failed:', error);
            errors.push(error.message);
          }
        }

        // Store generated questions
        await this.storeQuestions(questions, request.curriculum);

        // Update final status
        await this.updateProgress(requestId, {
          status: 'completed',
          generatedQuestions: questions,
          errors
        });

      } catch (err) {
        const error = err as Error;
        logger.error('Generation job failed:', error);
        await this.updateProgress(requestId, {
          status: 'failed',
          generatedQuestions: [],
          errors: [error.message]
        });
      }
    });
  }

  private async updateProgress(
    requestId: string,
    status: Partial<GenerationStatus>
  ): Promise<void> {
    const currentStatus = await this.redis.get(`request:${requestId}`);
    const updatedStatus: GenerationStatus = {
      status: 'pending',
      progress: status.generatedQuestions?.length || 0,
      totalQuestions: status.totalQuestions || 0,
      generatedQuestions: status.generatedQuestions || [],
      errors: status.errors || [],
      ...(currentStatus ? JSON.parse(currentStatus) : {}),
      ...status,
    };

    await this.redis.set(
      `request:${requestId}`,
      JSON.stringify(updatedStatus),
      'EX',
      3600
    );
  }

  private async storeQuestions(
    questions: Question[],
    curriculum: CurriculumMapping
  ): Promise<void> {
    await prisma.$transaction(
      questions.map(question =>
        prisma.generatedQuestion.create({
          data: {
            id: question.id,
            content: question.content,
            type: question.type,
            correctAnswer: question.correctAnswer,
            options: question.options || [],
            explanation: question.explanation,
            hints: question.hints,
            metadata: question.metadata,
            validation: question.validation
          }
        })
      )
    );
  }

  private async generateQuestion(
    curriculum: CurriculumMapping,
    difficulty: DifficultyLevel,
    previousQuestions: string[]
  ): Promise<Question> {
    const generatedQuestion = await this.engine.generateQuestion({
      subject: curriculum.subject,
      curriculum: curriculum as any,
      difficulty,
      previousQuestions
    }) as GeneratedQuestion;

    return {
      id: generatedQuestion.id,
      type: 'multiple',
      content: generatedQuestion.content,
      correctAnswer: generatedQuestion.answer || '',
      options: generatedQuestion.options || [],
      distractors: generatedQuestion.distractors || [],
      explanation: generatedQuestion.explanation || '',
      hints: generatedQuestion.hints || [],
      difficulty: difficulty,
      metadata: {
        curriculum,
        difficulty,
        generated: new Date().toISOString()
      },
      validation: {
        isValid: false,
        validatedAt: '',
        validatedBy: ''
      }
    };
  }
} 