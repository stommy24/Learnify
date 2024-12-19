import { OpenAI } from 'openai';
import { 
  AIQuestionRequest, 
  AIQuestionResponse, 
  ValidationResult 
} from '../types';

export class AIQuestionGenerator {
  private static instance: AIQuestionGenerator;
  private openai: OpenAI;

  private constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  static getInstance(): AIQuestionGenerator {
    if (!AIQuestionGenerator.instance) {
      AIQuestionGenerator.instance = new AIQuestionGenerator();
    }
    return AIQuestionGenerator.instance;
  }

  async generateQuestion(params: AIQuestionRequest): Promise<AIQuestionResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(params)
          },
          {
            role: "user",
            content: this.constructPrompt(params)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error('Empty response from OpenAI');
      }

      return this.parseResponse(response.choices[0].message.content, params);
    } catch (error) {
      throw new Error(`Failed to generate question: ${error.message}`);
    }
  }

  private getSystemPrompt(params: AIQuestionRequest): string {
    return `You are an educational AI assistant creating ${params.subject} questions for year ${params.yearGroup} students.`;
  }

  private constructPrompt(params: AIQuestionRequest): string {
    return `Generate a ${params.subject} question about ${params.topic} suitable for year ${params.yearGroup}, term ${params.term}, at difficulty level ${params.difficulty}.`;
  }

  private parseResponse(content: string, params: AIQuestionRequest): AIQuestionResponse {
    try {
      const parsed = JSON.parse(content);
      return {
        question: parsed.question,
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation,
        metadata: {
          difficulty: params.difficulty,
          yearGroup: params.yearGroup,
          term: params.term
        }
      };
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }
}

export const useAIQuestionGenerator = () => {
  const generator = AIQuestionGenerator.getInstance();
  return {
    generateQuestion: generator.generateQuestion.bind(generator)
  };
}; 