import OpenAI from 'openai';
import { 
  AIQuestionRequest, 
  AIQuestionResponse,
  AIServiceResponse,
  AIQuestionMetadata,
  Subject
} from '../types';
import { ErrorBoundary } from '../errors/ErrorBoundary';
import { RetryMechanism } from '../errors/RetryMechanism';

interface AIResponseFormat {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  metadata: {
    skillsTested: string[];
  };
}

export class OpenAIService {
  private static instance: OpenAIService;
  private openai: OpenAI;
  private errorBoundary: ErrorBoundary;
  private retryMechanism: RetryMechanism;
  private readonly defaultModel = 'gpt-4';

  private constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.errorBoundary = ErrorBoundary.getInstance();
    this.retryMechanism = RetryMechanism.getInstance();
  }

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async generateQuestion(params: AIQuestionRequest): Promise<AIServiceResponse> {
    return this.errorBoundary.handleError(
      async () => {
        const response = await this.retryMechanism.withRetry(
          () => this.generateQuestionInternal(params)
        );
        return {
          isValid: true,
          errors: [],
          warnings: [],
          response
        };
      },
      'AI_GENERATION_FAILED',
      { params }
    );
  }

  private async generateQuestionInternal(params: AIQuestionRequest): Promise<AIQuestionResponse> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.defaultModel,
        messages: [
          { 
            role: 'system', 
            content: this.getSystemPrompt(params)
          },
          { 
            role: 'user', 
            content: this.constructPrompt(params)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response generated from AI');
      }

      return this.parseResponse(content, params);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI generation failed: ${error.message}`);
      }
      throw new Error('Unknown error during AI generation');
    }
  }

  private getSystemPrompt(params: AIQuestionRequest): string {
    return `You are an expert ${params.subject} teacher creating questions for Year ${params.yearGroup} students.
Your task is to generate educational questions that are:
- Age-appropriate for ${params.yearGroup} year olds
- Aligned with the UK curriculum
- Clear and unambiguous
- Engaging and relevant
- At difficulty level ${params.difficulty} (1-5)

Respond in JSON format with the following structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The correct answer",
  "explanation": "Detailed explanation of the answer",
  "metadata": {
    "skillsTested": ["skill1", "skill2"]
  }
}`;
  }

  private constructPrompt(params: AIQuestionRequest): string {
    return `Generate a ${params.subject} question about ${params.topic} for Year ${params.yearGroup}, Term ${params.term}.
Difficulty Level: ${params.difficulty}/5
Learning Objective: ${params.learningObjective}

The question should be multiple choice with 4 options, where:
- Only one answer is correct
- Distractors are plausible but clearly incorrect
- Language is clear and appropriate for the age group
- Question tests understanding, not just recall`;
  }

  private parseResponse(content: string, params: AIQuestionRequest): AIQuestionResponse {
    try {
      const parsed = JSON.parse(content) as AIResponseFormat;
      
      if (!this.validateResponse(parsed)) {
        throw new Error('Invalid response format from AI');
      }

      const metadata: AIQuestionMetadata = {
        difficulty: params.difficulty,
        yearGroup: params.yearGroup,
        term: params.term,
        skillsTested: parsed.metadata.skillsTested
      };

      return {
        question: parsed.question,
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation,
        metadata
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse AI response: ${error.message}`);
      }
      throw new Error('Unknown error parsing AI response');
    }
  }

  private validateResponse(response: unknown): response is AIResponseFormat {
    const r = response as AIResponseFormat;
    return (
      typeof r?.question === 'string' &&
      Array.isArray(r?.options) &&
      typeof r?.correctAnswer === 'string' &&
      typeof r?.explanation === 'string' &&
      Array.isArray(r?.metadata?.skillsTested)
    );
  }
}

export const useOpenAI = () => {
  const service = OpenAIService.getInstance();
  return {
    generateQuestion: service.generateQuestion.bind(service)
  };
}; 