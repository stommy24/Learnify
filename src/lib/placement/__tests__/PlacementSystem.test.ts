import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { PlacementSystem } from '../PlacementSystem';
import { PlacementTestError } from '@/lib/errors/PlacementTestError';
import { PlacementTest, PlacementTestStatus } from '@/types/placement';

jest.mock('@prisma/client');

describe('PlacementSystem', () => {
  let prisma: jest.Mocked<PrismaClient>;
  let placementSystem: PlacementSystem;

  beforeEach(() => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    placementSystem = new PlacementSystem(prisma);
  });

  describe('startTest', () => {
    it('should calculate initial level correctly', async () => {
      const params = {
        age: 15,
        gradeLevel: 9,
        previousExperience: true,
        selfAssessment: {
          confidence: 4,
          subjectExperience: 4
        }
      };

      const mockTest: PlacementTest = {
        id: '123',
        studentId: 'student123',
        status: PlacementTestStatus.IN_PROGRESS,
        startLevel: 8,
        sections: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.$queryRaw.mockResolvedValue([mockTest]);

      const result = await placementSystem.startTest('student123', params);
      expect(result).toEqual(mockTest);
      expect(prisma.$queryRaw).toHaveBeenCalled();
    });
  });
}); 