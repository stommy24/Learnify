import { PrismaClient, PlacementTest, PlacementTestStatus } from '@prisma/client';
import { CustomError } from '../utils/CustomError';

export enum QuestionFormat {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  NUMERIC = 'NUMERIC',
  TEXT = 'TEXT'
}

interface PlacementQuestion {
  id: string;
  format: QuestionFormat;
  content: string;
  correctAnswer: string;
}

export class PlacementSystem {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async validateAnswer(question: PlacementQuestion, answer: string): Promise<boolean> {
    switch (question.format) {
      case QuestionFormat.MULTIPLE_CHOICE:
        return this.validateMultipleChoice(answer, question.correctAnswer);
      case QuestionFormat.NUMERIC:
        return this.validateNumeric(answer, question.correctAnswer);
      case QuestionFormat.TEXT:
        return this.validateText(answer, question.correctAnswer);
      default:
        throw new CustomError('Invalid question format', 'VALIDATION_ERROR');
    }
  }

  private validateMultipleChoice(answer: string, correctAnswer: string): boolean {
    return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }

  private validateNumeric(answer: string, correctAnswer: string): boolean {
    const numAnswer = parseFloat(answer);
    const numCorrect = parseFloat(correctAnswer);
    return !isNaN(numAnswer) && !isNaN(numCorrect) && numAnswer === numCorrect;
  }

  private validateText(answer: string, correctAnswer: string): boolean {
    return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }

  async startTest(userId: string): Promise<string> {
    try {
      const test = await this.prisma.placementTest.create({
        data: {
          status: 'IN_PROGRESS' as PlacementTestStatus,
          studentId: userId,
          startLevel: 1, // Default starting level
          finalLevel: null
        }
      });
      return test.id;
    } catch (error) {
      throw new CustomError('Failed to start test', 'DATABASE_ERROR');
    }
  }

  private async getQuestion(testId: string, questionId: string): Promise<PlacementQuestion | null> {
    try {
      const question = await this.prisma.placementQuestion.findUnique({
        where: { id: questionId }
      });
      
      if (!question) return null;
      
      return {
        id: question.id,
        format: question.type as QuestionFormat, // Map type to format
        content: question.content,
        correctAnswer: question.correctAnswer
      };
    } catch (error) {
      throw new CustomError('Failed to get question', 'DATABASE_ERROR');
    }
  }

  // ... rest of the implementation
} 