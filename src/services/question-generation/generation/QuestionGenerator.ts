import { OpenAI } from 'openai';
import { 
  Question, 
  QuestionTemplate, 
  CurriculumMapping, 
  DifficultyLevel,
  ValidationIssue 
} from '../types';
import { TemplateManager } from '../templates/TemplateManager';
import { QuestionValidator } from '../validation/QuestionValidator';
import { logger } from '@/utils/logger';
import { prisma } from '@/lib/prisma';

export class QuestionGenerator {
  private openai: OpenAI;
  private templateManager: TemplateManager;
  private validator: QuestionValidator;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.templateManager = new TemplateManager();
    this.validator = new QuestionValidator();
  }

  async generateQuestion(params: {
    curriculum: CurriculumMapping;
    difficulty: DifficultyLevel;
    excludeIds?: string[];
    retryCount?: number;
  }): Promise<Question> {
    const retryCount = params.retryCount || 0;
    const maxRetries = 3;

    try {
      // 1. Get appropriate template
      const template = this.templateManager.getTemplate({
        subject: params.curriculum.subject,
        curriculum: params.curriculum,
        difficulty: params.difficulty,
        excludeIds: params.excludeIds
      });

      // 2. Generate question content
      const questionContent = await this.generateQuestionContent(template, params.curriculum);

      // 3. Generate answer and distractors
      const { answer, distractors } = await this.generateAnswerContent(
        questionContent,
        template,
        params.curriculum
      );

      // 4. Create question object
      const question: Question = {
        id: this.generateQuestionId(),
        type: template.type,
        content: questionContent,
        answer,
        distractors,
        explanation: await this.generateExplanation(questionContent, answer, template),
        hints: await this.generateHints(questionContent, template),
        metadata: {
          curriculum: params.curriculum,
          difficulty: params.difficulty,
          generated: new Date().toISOString(),
          usageCount: 0,
        },
        validation: {
          isValid: false,
          validatedAt: new Date().toISOString(),
          validatedBy: 'system'
        }
      };

      // 5. Validate question
      const validationIssues = await this.validator.validateQuestion(
        question,
        params.curriculum
      );

      if (this.shouldRegenerateQuestion(validationIssues)) {
        if (retryCount < maxRetries) {
          logger.warn('Regenerating question due to validation issues', {
            questionId: question.id,
            retryCount,
            issues: validationIssues
          });
          return this.generateQuestion({
            ...params,
            retryCount: retryCount + 1,
            excludeIds: [...(params.excludeIds || []), template.id]
          });
        }
        throw new Error('Failed to generate valid question after max retries');
      }

      // 6. Store question
      await this.storeQuestion(question);

      return question;

    } catch (error) {
      logger.error('Question generation failed:', error);
      throw new Error('Failed to generate question');
    }
  }

  private async generateQuestionContent(
    template: QuestionTemplate,
    curriculum: CurriculumMapping
  ): Promise<string> {
    const prompt = this.buildQuestionPrompt(template, curriculum);
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are an expert ${curriculum.subject} teacher, creating questions for Year ${curriculum.year} students.`
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 200
    });

    return completion.choices[0].message.content || '';
  }

  private async generateAnswerContent(
    questionContent: string,
    template: QuestionTemplate,
    curriculum: CurriculumMapping
  ): Promise<{ answer: string; distractors?: string[] }> {
    const prompt = `
      For this ${curriculum.subject} question for Year ${curriculum.year}:
      "${questionContent}"
      
      Generate:
      1. The correct answer
      ${template.type === 'multipleChoice' ? '2. Three plausible but incorrect options' : ''}
      
      Ensure all answers are:
      - Age-appropriate
      - Clear and unambiguous
      - Relevant to the topic: ${curriculum.topic}
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Generate precise and accurate answers for educational questions."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.5
    });

    const response = completion.choices[0].message.content || '';
    return this.parseAnswerResponse(response, template.type);
  }

  private async generateExplanation(
    question: string,
    answer: string,
    template: QuestionTemplate
  ): Promise<string> {
    const prompt = `
      Explain this answer in a way that helps students understand:
      Question: ${question}
      Answer: ${answer}
      
      Provide a clear, step-by-step explanation suitable for the level.
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Explain educational concepts clearly and simply."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.5
    });

    return completion.choices[0].message.content || '';
  }

  private async generateHints(
    question: string,
    template: QuestionTemplate
  ): Promise<string[]> {
    const prompt = `
      Generate 2-3 helpful hints for this question:
      "${question}"
      
      Hints should:
      - Guide thinking without giving away the answer
      - Progress from general to specific
      - Be age-appropriate
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Create helpful educational hints."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.5
    });

    return (completion.choices[0].message.content || '')
      .split('\n')
      .filter(hint => hint.trim().length > 0);
  }

  private shouldRegenerateQuestion(issues: ValidationIssue[]): boolean {
    return issues.some(issue => issue.severity === 'high') ||
           issues.filter(issue => issue.severity === 'medium').length > 2;
  }

  private async storeQuestion(question: Question): Promise<void> {
    await prisma.generatedQuestion.create({
      data: {
        id: question.id,
        type: question.type,
        content: question.content,
        answer: question.answer,
        distractors: question.distractors,
        explanation: question.explanation,
        hints: question.hints,
        metadata: question.metadata,
        validation: question.validation
      }
    });
  }

  private generateQuestionId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private buildQuestionPrompt(
    template: QuestionTemplate,
    curriculum: CurriculumMapping
  ): string {
    return `
      Create a ${template.type} question for Year ${curriculum.year} ${curriculum.subject}.
      
      Topic: ${curriculum.topic}
      Learning Objectives: ${curriculum.learningObjectives.join(', ')}
      
      Template Structure:
      ${JSON.stringify(template.structure, null, 2)}
      
      Requirements:
      - Align with UK National Curriculum
      - Age-appropriate language
      - Clear and unambiguous
      - Engaging and relevant
      - Appropriate difficulty level
    `;
  }

  private parseAnswerResponse(
    response: string,
    type: QuestionTemplate['type']
  ): { answer: string; distractors?: string[] } {
    // Implement parsing logic based on response format
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      answer: lines[0],
      distractors: type === 'multipleChoice' ? lines.slice(1) : undefined
    };
  }
} 