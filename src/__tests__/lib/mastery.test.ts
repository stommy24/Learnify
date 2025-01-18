import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { MasterySystem, MasteryAttemptInput, MasteryProgress } from '@/lib/mastery';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

// Create a mock type for PrismaClient
let prisma: DeepMockProxy<PrismaClient>;

describe('MasterySystem', () => {
  let masterySystem: MasterySystem;

  beforeEach(() => {
    // Create a fresh mock for each test
    prisma = mockDeep<PrismaClient>();
    masterySystem = new MasterySystem(prisma);
  });

  describe('submitAttempt', () => {
    it('should process a successful attempt', async () => {
      const attempt: MasteryAttemptInput = {
        userId: 'user123',
        score: 85,
        timeSpent: 300
      };

      const expectedProgress = {
        id: '1',
        userId: 'test-user',
        topicId: 'test-topic',
        score: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Setup the mock with proper typing
      prisma.masteryProgress.upsert.mockResolvedValueOnce(expectedProgress);

      const result = await masterySystem.submitAttempt(attempt);
      expect(result.consecutiveSuccesses).toBe(1);
      expect(result.studentId).toBe('user123');
    });

    it('should handle consecutive successes', async () => {
      const attempt: MasteryAttemptInput = {
        userId: 'user123',
        score: 90,
        timeSpent: 250
      };

      const mockProgress = {
        id: '2',
        userId: 'test-user',
        topicId: 'test-topic',
        score: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Setup the mock with proper typing
      prisma.masteryProgress.upsert.mockResolvedValueOnce(mockProgress);

      const result = await masterySystem.submitAttempt(attempt);
      expect(result.consecutiveSuccesses).toBe(2);
      expect(result.studentId).toBe('user123');
    });
  });
}); 