import { PrismaClient } from '@prisma/client';
import { 
  PlacementTest, 
  PlacementQuestion, 
  PlacementTestStatus,
  InitialPlacementParams 
} from '@/types/placement';
import { 
  PlacementTestError, 
  PlacementTestErrorCodes 
} from '@/lib/errors/PlacementTestError';

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
        throw new PlacementTestError(
          'Test not found',
          PlacementTestErrorCodes.TEST_NOT_FOUND,
          404
        );
      }

      if (test.status === PlacementTestStatus.COMPLETED) {
        throw new PlacementTestError(
          'Test has already been completed',
          PlacementTestErrorCodes.TEST_ALREADY_COMPLETED,
          400
        );
      }

      const question = await this.prisma.$queryRaw<PlacementQuestion>`
        SELECT * FROM "PlacementQuestion" WHERE id = ${questionId}
      `;

      if (!question) {
        throw new PlacementTestError(
          'Question not found',
          PlacementTestErrorCodes.INVALID_QUESTION,
          404
        );
      }

      if (!this.validateAnswer(question, answer)) {
        throw new PlacementTestError(
          'Invalid answer format',
          PlacementTestErrorCodes.INVALID_ANSWER,
          400
        );
      }

      if (await this.isRateLimited(testId)) {
        throw new PlacementTestError(
          'Too many answers submitted recently',
          PlacementTestErrorCodes.RATE_LIMIT_EXCEEDED,
          429
        );
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
        throw new PlacementTestError(
          'Database operation failed',
          PlacementTestErrorCodes.DATABASE_ERROR,
          500
        );
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
      throw new PlacementTestError(
        'Test not found',
        PlacementTestErrorCodes.TEST_NOT_FOUND,
        404
      );
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
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return ['A', 'B', 'C', 'D'].includes(answer);
      case 'NUMERIC':
        return !isNaN(Number(answer));
      case 'TEXT':
        return answer.length > 0 && answer.length <= 1000;
      default:
        return false;
    }
  }
}

export const placementSystem = new PlacementSystem(); 