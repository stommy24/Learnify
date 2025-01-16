import { PlacementSystem, QuestionFormat } from '../PlacementSystem';
import { PrismaClient, PlacementTest, PlacementTestStatus } from '@prisma/client';
import { jest } from '@jest/globals';

// Define mock functions with proper return types
const mockCreate = jest.fn<
  (args: { data: any }) => Promise<PlacementTest>
>();

const mockFindUnique = jest.fn<
  (args: { where: { id: string } }) => Promise<PlacementTest | null>
>();

// Create mock client object with type assertion
const mockPrismaClient = {
  placementTest: {
    create: mockCreate,
  },
  placementQuestion: {
    findUnique: mockFindUnique
  }
} as unknown as PrismaClient;

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient)
}));

describe('PlacementSystem', () => {
  let system: PlacementSystem;

  beforeEach(() => {
    jest.clearAllMocks();
    system = new PlacementSystem(mockPrismaClient);
  });

  describe('startTest', () => {
    it('should create a new placement test', async () => {
      const mockTest: PlacementTest = {
        id: 'test1',
        status: 'IN_PROGRESS' as PlacementTestStatus,
        studentId: 'user1',
        startLevel: 1,
        finalLevel: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockCreate.mockResolvedValue(mockTest);

      const studentId = 'user1';
      const result = await system.startTest(studentId);

      expect(result).toEqual(mockTest.id);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          status: 'IN_PROGRESS',
          studentId: studentId,
          startLevel: 1,
          finalLevel: null
        }
      });
    });

    it('should throw error when creation fails', async () => {
      mockCreate.mockRejectedValue(new Error('DB Error'));

      await expect(system.startTest('user1'))
        .rejects
        .toThrow('DATABASE_ERROR');
    });
  });

  describe('validateAnswer', () => {
    const mockQuestion = {
      id: 'q1',
      format: QuestionFormat.MULTIPLE_CHOICE,
      content: 'What is 2+2?',
      correctAnswer: '4'
    };

    it('should validate multiple choice answers', async () => {
      const result = await system.validateAnswer(mockQuestion, '4');
      expect(result).toBe(true);

      const wrongResult = await system.validateAnswer(mockQuestion, '5');
      expect(wrongResult).toBe(false);
    });

    it('should validate numeric answers', async () => {
      const numericQuestion = { ...mockQuestion, format: QuestionFormat.NUMERIC };
      const result = await system.validateAnswer(numericQuestion, '4');
      expect(result).toBe(true);

      const wrongResult = await system.validateAnswer(numericQuestion, 'four');
      expect(wrongResult).toBe(false);
    });

    it('should validate text answers', async () => {
      const textQuestion = { ...mockQuestion, format: QuestionFormat.TEXT };
      const result = await system.validateAnswer(textQuestion, '4');
      expect(result).toBe(true);

      const wrongResult = await system.validateAnswer(textQuestion, 'four');
      expect(wrongResult).toBe(false);
    });

    it('should throw error for invalid format', async () => {
      const invalidQuestion = { ...mockQuestion, format: 'INVALID' as QuestionFormat };
      await expect(system.validateAnswer(invalidQuestion, '4'))
        .rejects
        .toThrow('VALIDATION_ERROR');
    });
  });
}); 