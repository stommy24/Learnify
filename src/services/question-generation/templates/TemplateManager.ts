import { Subject, QuestionTemplate, CurriculumMapping, DifficultyLevel } from '../types';
import { mathsTemplates } from './mathsTemplates';
import { englishTemplates } from './englishTemplates';
import { logger } from '@/utils/logger';

export class TemplateManager {
  private templates: Map<Subject, QuestionTemplate[]>;
  private templateCache: Map<string, QuestionTemplate>;

  constructor() {
    this.templates = new Map([
      ['mathematics', mathsTemplates],
      ['english', englishTemplates]
    ]);
    this.templateCache = new Map();
  }

  getTemplate(params: {
    subject: Subject;
    curriculum: CurriculumMapping;
    difficulty: DifficultyLevel;
    excludeIds?: string[];
  }): QuestionTemplate {
    const cacheKey = this.buildCacheKey(params);
    const cached = this.templateCache.get(cacheKey);
    
    if (cached && !params.excludeIds?.includes(cached.id)) {
      return cached;
    }

    const suitable = this.findSuitableTemplates(params);
    
    if (suitable.length === 0) {
      logger.warn('No suitable templates found, falling back to default', params);
      throw new Error('No suitable template found');
    }

    const selected = this.selectOptimalTemplate(suitable, params);
    this.templateCache.set(cacheKey, selected);
    
    return selected;
  }

  private findSuitableTemplates(params: {
    subject: Subject;
    curriculum: CurriculumMapping;
    difficulty: DifficultyLevel;
    excludeIds?: string[];
  }): QuestionTemplate[] {
    const subjectTemplates = this.templates.get(params.subject) || [];
    
    return subjectTemplates.filter(template => 
      this.isTemplateSuitable(template, params)
    );
  }

  private isTemplateSuitable(
    template: QuestionTemplate,
    params: {
      curriculum: CurriculumMapping;
      difficulty: DifficultyLevel;
      excludeIds?: string[];
    }
  ): boolean {
    return (
      template.curriculum.keyStage === params.curriculum.keyStage &&
      template.curriculum.year === params.curriculum.year &&
      template.curriculum.topic === params.curriculum.topic &&
      template.difficulty === params.difficulty &&
      !params.excludeIds?.includes(template.id)
    );
  }

  private selectOptimalTemplate(
    templates: QuestionTemplate[],
    params: {
      curriculum: CurriculumMapping;
      difficulty: DifficultyLevel;
    }
  ): QuestionTemplate {
    // Implement template selection logic based on:
    // 1. Usage statistics
    // 2. Success rate
    // 3. Learning objectives coverage
    // 4. Variety in question types
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private buildCacheKey(params: {
    subject: Subject;
    curriculum: CurriculumMapping;
    difficulty: DifficultyLevel;
  }): string {
    return `${params.subject}:${params.curriculum.year}:${params.curriculum.topic}:${params.difficulty}`;
  }
} 