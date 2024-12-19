import { QuestionGenerationEngine } from './QuestionGenerationEngine';
import { Subject, CurriculumMapping, DifficultyLevel } from './types';
import { prisma } from '@/lib/prisma';
import { redisService } from '@/lib/cache/redis';

export class QuestionService {
  private engine: QuestionGenerationEngine;
  
  constructor() {
    this.engine = new QuestionGenerationEngine();
  }

  async generateQuestionSet(params: {
    subject: Subject;
    curriculum: CurriculumMapping;
    count: number;
    difficulty: DifficultyLevel;
  }) {
    const cacheKey = `question_set:${JSON.stringify(params)}`;
    const cached = await redisService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const questions = [];
    const previousQuestions = [];

    for (let i = 0; i < params.count; i++) {
      const question = await this.engine.generateQuestion({
        ...params,
        previousQuestions
      });

      questions.push(question);
      previousQuestions.push(question.content);
    }

    // Cache the question set
    await redisService.set(cacheKey, questions, 3600); // Cache for 1 hour

    // Store in database for analysis
    await this.storeQuestions(questions, params);

    return questions;
  }

  private async storeQuestions(
    questions: any[],
    params: {
      subject: Subject;
      curriculum: CurriculumMapping;
    }
  ) {
    await prisma.generatedQuestion.createMany({
      data: questions.map(q => ({
        content: q.content,
        metadata: q.metadata,
        subject: params.subject,
        curriculumMapping: params.curriculum,
        template: q.template
      }))
    });
  }
} 