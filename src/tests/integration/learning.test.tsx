import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PracticeService } from '@/services/PracticeService';
import prisma from '@/lib/db';

// Mock prisma
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    assessment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    },
    question: {
      findMany: jest.fn()
    },
    questionAnswer: {
      createMany: jest.fn()
    },
    progress: {
      upsert: jest.fn()
    }
  }
}));

describe('PracticeService Integration Tests', () => {
  const mockQuestions = [
    {
      id: '1',
      text: 'What is 2 + 2?',
      type: 'MULTIPLE_CHOICE',
      correctAnswer: '4',
      difficulty: 1,
      topic: 'basic-math'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePracticeSession', () => {
    it('should generate a practice session', async () => {
      const mockAssessment = {
        id: 'test-id',
        userId: 'user-1',
        createdAt: new Date(),
        questions: mockQuestions
      };

      (prisma.question.findMany as jest.Mock).mockResolvedValueOnce(mockQuestions);
      (prisma.assessment.create as jest.Mock).mockResolvedValueOnce(mockAssessment);

      const session = await PracticeService.generatePracticeSession('user-1', 'basic-math', 1);

      expect(session).toEqual({
        id: mockAssessment.id,
        userId: 'user-1',
        topicId: 'basic-math',
        questions: expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            content: 'What is 2 + 2?',
            type: 'multiple-choice'
          })
        ]),
        startTime: mockAssessment.createdAt
      });
    });
  });

  describe('submitPracticeResults', () => {
    it('should submit and process practice results', async () => {
      const mockAssessment = {
        id: 'test-id',
        userId: 'user-1',
        questions: mockQuestions
      };

      (prisma.assessment.findUnique as jest.Mock).mockResolvedValueOnce(mockAssessment);
      (prisma.assessment.update as jest.Mock).mockResolvedValueOnce({});
      (prisma.questionAnswer.createMany as jest.Mock).mockResolvedValueOnce({});
      (prisma.progress.upsert as jest.Mock).mockResolvedValueOnce({});

      const results = {
        answers: [{
          questionId: '1',
          answer: '4',
          timeSpent: 30
        }],
        totalTimeSpent: 30
      };

      await PracticeService.submitPracticeResults('test-id', results);

      expect(prisma.assessment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'test-id' },
          data: expect.objectContaining({
            status: 'COMPLETED',
            score: 1
          })
        })
      );
    });

    it('should throw error if session not found', async () => {
      (prisma.assessment.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        PracticeService.submitPracticeResults('invalid-id', {
          answers: [],
          totalTimeSpent: 0
        })
      ).rejects.toThrow('Practice session not found');
    });
  });
}); 