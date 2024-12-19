import { 
    Question,
    ValidationResult,
    AIQuestionRequest,
    AIQuestionResponse,
    Subject,
    MathsTopic,
    EnglishTopic
  } from '../types';
  import { AIQuestionGenerator } from './QuestionGenerator';
  import { QuestionValidator } from './QuestionValidator';
  
  export interface QuizConfig {
    subject: Subject;
    topics: (MathsTopic | EnglishTopic)[];
    yearGroup: number;
    term: number;
    questionCount: number;
    difficulty: 1 | 2 | 3 | 4 | 5;
  }
  
  export interface GeneratedQuiz {
    id: string;
    config: QuizConfig;
    questions: Question[];
    metadata: {
      generatedAt: Date;
      difficulty: number;
      estimatedTime: number;
      topicsCovered: (MathsTopic | EnglishTopic)[];
    };
  }
  
  export class QuizGenerator {
    private static instance: QuizGenerator;
    private questionGenerator: AIQuestionGenerator;
    private questionValidator: QuestionValidator;
  
    private constructor() {
      this.questionGenerator = AIQuestionGenerator.getInstance();
      this.questionValidator = QuestionValidator.getInstance();
    }
  
    static getInstance(): QuizGenerator {
      if (!QuizGenerator.instance) {
        QuizGenerator.instance = new QuizGenerator();
      }
      return QuizGenerator.instance;
    }
  
    async generateQuiz(config: QuizConfig): Promise<ValidationResult & { quiz?: GeneratedQuiz }> {
      try {
        const questions: Question[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];
        const topicsCovered = new Set<MathsTopic | EnglishTopic>();
  
        for (let i = 0; i < config.questionCount; i++) {
          const topic = config.topics[i % config.topics.length];
          topicsCovered.add(topic);
          
          const questionRequest: AIQuestionRequest = {
            subject: config.subject,
            topic,
            yearGroup: config.yearGroup,
            term: config.term,
            difficulty: config.difficulty,
            questionType: 'multiple-choice', // Default type
            learningObjective: `Generate ${config.subject} question for ${topic}`
          };
  
          try {
            const generatedQuestion = await this.questionGenerator.generateQuestion(questionRequest);
            const validation = await this.questionValidator.validateQuestion(generatedQuestion, questionRequest);
  
            if (validation.isValid) {
              questions.push(this.convertToQuestion(generatedQuestion, topic, i));
            } else {
              errors.push(`Question ${i + 1} validation failed: ${validation.errors.join(', ')}`);
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`Failed to generate question ${i + 1}: ${errorMessage}`);
          }
        }
  
        if (questions.length === 0) {
          return {
            isValid: false,
            errors: ['Failed to generate any valid questions', ...errors],
            warnings
          };
        }
  
        const quiz: GeneratedQuiz = {
          id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          config,
          questions,
          metadata: {
            generatedAt: new Date(),
            difficulty: config.difficulty,
            estimatedTime: questions.length * 2 * 60, // 2 minutes per question
            topicsCovered: Array.from(topicsCovered)
          }
        };
  
        return {
          isValid: true,
          errors,
          warnings,
          quiz
        };
  
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          isValid: false,
          errors: [`Quiz generation failed: ${errorMessage}`],
          warnings: []
        };
      }
    }
  
    private convertToQuestion(
      generated: AIQuestionResponse, 
      topic: MathsTopic | EnglishTopic,
      index: number
    ): Question {
      return {
        id: `q_${Date.now()}_${index}`,
        type: 'multiple-choice',
        topic,
        question: generated.question,
        options: generated.options || [],
        correctAnswer: generated.correctAnswer,
        explanation: generated.explanation,
        metadata: generated.metadata
      };
    }
  }
  
  export const useQuizGenerator = () => {
    const generator = QuizGenerator.getInstance();
    return {
      generateQuiz: generator.generateQuiz.bind(generator)
    };
  };