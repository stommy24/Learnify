import { OpenAI } from 'openai';
import { 
  QuestionTemplate, 
  Subject, 
  DifficultyLevel, 
  CurriculumMapping 
} from './types';
import { mathsTemplates } from './templates/mathsTemplates';
import { englishTemplates } from './templates/englishTemplates';
import { logger } from '@/utils/logger';

export class QuestionGenerationEngine {
  private openai: OpenAI;
  private templates: Map<Subject, QuestionTemplate[]>;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.templates = new Map([
      ['mathematics', mathsTemplates],
      ['english', englishTemplates]
    ]);
  }

  async generateQuestion(params: {
    subject: Subject;
    curriculum: CurriculumMapping;
    difficulty: DifficultyLevel;
    previousQuestions?: string[];
  }) {
    try {
      // 1. Select appropriate template
      const template = this.selectTemplate(params);
      
      // 2. Generate question content
      const questionContent = await this.generateContent(template, params);
      
      // 3. Generate distractors if multiple choice
      const distractors = template.type === 'multipleChoice' 
        ? await this.generateDistractors(questionContent, template)
        : [];

      // 4. Validate question
      await this.validateQuestion({
        template,
        content: questionContent,
        distractors,
        curriculum: params.curriculum
      });

      return {
        id: this.generateQuestionId(),
        template: template.type,
        content: questionContent,
        distractors,
        metadata: {
          curriculum: params.curriculum,
          difficulty: params.difficulty,
          generated: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error('Question generation failed:', error);
      throw new Error('Failed to generate question');
    }
  }

  private selectTemplate(params: {
    subject: Subject;
    curriculum: CurriculumMapping;
    difficulty: DifficultyLevel;
  }): QuestionTemplate {
    const templates = this.templates.get(params.subject) || [];
    
    const suitable = templates.filter(t => 
      t.curriculum.keyStage === params.curriculum.keyStage &&
      t.curriculum.year === params.curriculum.year &&
      t.difficulty === params.difficulty &&
      t.curriculum.topic === params.curriculum.topic
    );

    if (suitable.length === 0) {
      throw new Error('No suitable template found');
    }

    return suitable[Math.floor(Math.random() * suitable.length)];
  }

  private async generateContent(
    template: QuestionTemplate,
    params: { curriculum: CurriculumMapping }
  ): Promise<string> {
    const prompt = this.buildPrompt(template, params.curriculum);
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are a professional education content creator, specialized in creating questions aligned with the UK National Curriculum."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content || '';
  }

  private async generateDistractors(
    correctAnswer: string,
    template: QuestionTemplate
  ): Promise<string[]> {
    const prompt = `Generate 3 plausible but incorrect answers for this question. 
                   The correct answer is: ${correctAnswer}
                   Topic: ${template.curriculum.topic}
                   Year: ${template.curriculum.year}`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Generate plausible distractors for multiple choice questions."
      }, {
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 100
    });

    return completion.choices[0].message.content?.split('\n') || [];
  }

  private async validateQuestion(params: {
    template: QuestionTemplate;
    content: string;
    distractors: string[];
    curriculum: CurriculumMapping;
  }): Promise<boolean> {
    // Implement validation logic here
    // Check for:
    // 1. Appropriate difficulty level
    // 2. Curriculum alignment
    // 3. Language appropriateness
    // 4. Technical accuracy
    return true;
  }

  private generateQuestionId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private buildPrompt(
    template: QuestionTemplate,
    curriculum: CurriculumMapping
  ): string {
    return `Generate a ${template.type} question for:
            Subject: ${curriculum.subject}
            Year: ${curriculum.year}
            Topic: ${curriculum.topic}
            Learning Objectives: ${curriculum.learningObjectives.join(', ')}
            
            Use this template structure:
            ${JSON.stringify(template.structure, null, 2)}
            
            Ensure the question is age-appropriate and aligned with the UK National Curriculum.`;
  }
} 