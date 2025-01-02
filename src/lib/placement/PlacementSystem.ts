import { PrismaClient } from '@prisma/client';
import { 
  PlacementTest, 
  PlacementQuestion, 
  PlacementTestStatus,
  InitialPlacementParams,
  PlacementTestError,
  PlacementTestErrorCodes,
  QuestionType,
  EvaluationResult
} from '@/types/placement';
import { CustomError } from '@/lib/utils/CustomError';

export class PlacementSystem {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  async startTest(studentId: string, params: InitialPlacementParams) {
    const initialLevel = this.calculateInitialLevel(params);

    return await this.prisma.$queryRaw<PlacementTest>`
      INSERT INTO "PlacementTest" ("studentId", "status", "startLevel")
      VALUES (${studentId}, ${PlacementTestStatus.IN_PROGRESS}, ${initialLevel})
      RETURNING *
    `;
  }

  async submitAnswer(testId: string, questionId: string, answer: string, timeSpent: number) {
    try {
      const test = await this.prisma.$queryRaw<PlacementTest>`
        SELECT * FROM "PlacementTest" WHERE id = ${testId}
      `;

      if (!test) {
        throw new Error(PlacementTestErrorCodes.TEST_NOT_FOUND);
      }

      if (test.status === PlacementTestStatus.COMPLETED) {
        throw new Error(PlacementTestErrorCodes.TEST_ALREADY_COMPLETED);
      }

      const question = await this.prisma.$queryRaw<PlacementQuestion>`
        SELECT * FROM "PlacementQuestion" WHERE id = ${questionId}
      `;

      if (!question) {
        throw new Error(PlacementTestErrorCodes.INVALID_QUESTION);
      }

      if (!this.validateAnswer(question, answer)) {
        throw new Error(PlacementTestErrorCodes.INVALID_ANSWER);
      }

      if (await this.isRateLimited(testId)) {
        throw new Error(PlacementTestErrorCodes.RATE_LIMIT_EXCEEDED);
      }

      const updatedQuestion = await this.prisma.$executeRaw`
        UPDATE "PlacementQuestion"
        SET answer = ${answer}, "timeSpent" = ${timeSpent}, 
            "isCorrect" = ${answer === question.correctAnswer}
        WHERE id = ${questionId}
        RETURNING *
      `;

      return this.getNextQuestion(testId, question.difficulty);
    } catch (error) {
      if (error instanceof PlacementTestError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new Error(PlacementTestErrorCodes.DATABASE_ERROR);
      }

      throw error;
    }
  }

  async getNextQuestion(testId: string, currentDifficulty: number): Promise<PlacementQuestion | null> {
    const test = await this.prisma.$queryRaw<PlacementTest>`
      SELECT * FROM "PlacementTest" 
      WHERE id = ${testId}
    `;

    if (!test) {
      throw new Error(PlacementTestErrorCodes.TEST_NOT_FOUND);
    }

    // Logic to select next question based on difficulty
    return null;
  }

  private async isRateLimited(testId: string): Promise<boolean> {
    const recentAnswers = await this.prisma.$queryRaw<[{ count: number }]>`
      SELECT COUNT(*) as count
      FROM "PlacementQuestion"
      WHERE "testId" = ${testId}
      AND "updatedAt" >= NOW() - INTERVAL '1 minute'
    `;

    return recentAnswers[0].count > 30;
  }

  private calculateInitialLevel(params: InitialPlacementParams): number {
    const { age, gradeLevel, previousExperience, selfAssessment } = params;
    let level = Math.floor((age - 5) * 1.5);
    
    if (gradeLevel) {
      level = Math.max(level, gradeLevel);
    }

    if (previousExperience) {
      level += 1;
    }

    if (selfAssessment) {
      const confidenceBonus = (selfAssessment.confidence - 3) * 0.5;
      const experienceBonus = (selfAssessment.subjectExperience - 3) * 0.5;
      level += confidenceBonus + experienceBonus;
    }

    return Math.max(1, Math.min(Math.round(level), 10));
  }

  private validateAnswer(question: PlacementQuestion, answer: string): boolean {
    try {
      const result = this.checkAnswer(question, answer);
      
      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        return result === question.correctAnswer;
      } else if (question.type === QuestionType.NUMERIC) {
        return Math.abs(result - parseFloat(question.correctAnswer)) < 0.01;
      } else if (question.type === QuestionType.TEXT) {
        return result.toLowerCase() === question.correctAnswer.toLowerCase();
      }
      
      throw new CustomError('VALIDATION_ERROR', 'Invalid question type');
    } catch (error) {
      throw new CustomError('VALIDATION_ERROR', 'Failed to validate answer');
    }
  }

  private checkAnswer(question: PlacementQuestion, answer: string): any {
    // Add validation logic here
    return answer;
  }

  async getTestResult(testId: string) {
    try {
      // Implementation
      return result;
    } catch (error) {
      throw new CustomError('Failed to get test result');
    }
  }

  private handleError(error: Error): never {
    throw new PlacementTestError(
      PlacementTestErrorCodes.SYSTEM_ERROR,
      error.message
    );
  }

  async evaluateAnswer(
    testId: string,
    questionId: string,
    answer: string,
    currentDifficulty: number
  ): Promise<EvaluationResult> {
    const question = await this.getQuestion(testId, questionId);
    if (!question) {
      throw new PlacementTestError(
        PlacementTestErrorCodes.INVALID_QUESTION,
        'Question not found'
      );
    }

    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return this.evaluateMultipleChoice(question, answer);
      case QuestionType.NUMERIC:
        return this.evaluateNumeric(question, answer);
      case QuestionType.TEXT:
        return this.evaluateTextInput(question, answer);
      default:
        throw new PlacementTestError(
          PlacementTestErrorCodes.INVALID_QUESTION,
          'Invalid question type'
        );
    }
  }

  private async getQuestion(testId: string, questionId: string): Promise<PlacementQuestion | null> {
    // Implementation to fetch question from database
    // ... existing code ...
  }

  private evaluateMultipleChoice(question: PlacementQuestion, answer: string): EvaluationResult {
    return {
      isCorrect: question.correctAnswer === answer,
      score: question.correctAnswer === answer ? 1 : 0,
      feedback: question.correctAnswer === answer ? 'Correct!' : 'Incorrect. Try again.'
    };
  }

  private evaluateNumeric(question: PlacementQuestion, answer: string): EvaluationResult {
    const numericAnswer = parseFloat(answer);
    const correctAnswer = parseFloat(question.correctAnswer);
    const isCorrect = !isNaN(numericAnswer) && !isNaN(correctAnswer) && 
                     Math.abs(numericAnswer - correctAnswer) < 0.001;
    
    return {
      isCorrect,
      score: isCorrect ? 1 : 0,
      feedback: isCorrect ? 'Correct!' : 'Incorrect. Try again.'
    };
  }

  private evaluateTextInput(question: PlacementQuestion, answer: string): EvaluationResult {
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = question.correctAnswer.trim().toLowerCase();
    
    return {
      isCorrect: normalizedAnswer === normalizedCorrect,
      score: normalizedAnswer === normalizedCorrect ? 1 : 0,
      feedback: normalizedAnswer === normalizedCorrect ? 'Correct!' : 'Incorrect. Try again.'
    };
  }
}

export const placementSystem = new PlacementSystem(); 