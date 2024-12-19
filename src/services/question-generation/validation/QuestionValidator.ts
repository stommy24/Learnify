import { Question, ValidationIssue, CurriculumMapping } from '../types';
import { OpenAI } from 'openai';
import { logger } from '@/utils/logger';

export class QuestionValidator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async validateQuestion(
    question: Question,
    curriculum: CurriculumMapping
  ): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    try {
      // Parallel validation checks
      const [
        curriculumIssues,
        languageIssues,
        technicalIssues
      ] = await Promise.all([
        this.validateCurriculumAlignment(question, curriculum),
        this.validateLanguage(question, curriculum),
        this.validateTechnicalAccuracy(question)
      ]);

      issues.push(...curriculumIssues, ...languageIssues, ...technicalIssues);

      // Log validation results
      logger.info('Question validation completed', {
        questionId: question.id,
        issueCount: issues.length,
        severity: this.getHighestSeverity(issues)
      });

      return issues;
    } catch (error) {
      logger.error('Question validation failed:', error);
      throw new Error('Validation failed');
    }
  }

  private async validateCurriculumAlignment(
    question: Question,
    curriculum: CurriculumMapping
  ): Promise<ValidationIssue[]> {
    const prompt = `
      Analyze this question for curriculum alignment:
      Question: ${question.content}
      Year: ${curriculum.year}
      Topic: ${curriculum.topic}
      Learning Objectives: ${curriculum.learningObjectives.join(', ')}
      
      Identify any misalignments or issues.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are an educational content validator specializing in UK National Curriculum alignment."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.3
    });

    // Process and structure the response
    return this.processValidationResponse(response.choices[0].message.content || '', 'curriculum');
  }

  private async validateLanguage(
    question: Question,
    curriculum: CurriculumMapping
  ): Promise<ValidationIssue[]> {
    // Implement language validation
    return [];
  }

  private async validateTechnicalAccuracy(
    question: Question
  ): Promise<ValidationIssue[]> {
    // Implement technical validation
    return [];
  }

  private processValidationResponse(
    response: string,
    type: ValidationIssue['type']
  ): ValidationIssue[] {
    // Process the AI response into structured validation issues
    return [];
  }

  private getHighestSeverity(issues: ValidationIssue[]): ValidationIssue['severity'] {
    if (issues.some(i => i.severity === 'high')) return 'high';
    if (issues.some(i => i.severity === 'medium')) return 'medium';
    return 'low';
  }
} 