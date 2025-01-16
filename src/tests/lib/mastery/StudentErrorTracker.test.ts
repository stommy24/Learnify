import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { StudentErrorTracker } from '@/lib/mastery/StudentErrorTracker';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    errorPattern: {
      create: jest.fn()
    }
  }))
}));

describe('StudentErrorTracker', () => {
  let tracker: StudentErrorTracker;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    tracker = new StudentErrorTracker(mockPrisma);
  });

  it('should save error patterns to database', async () => {
    const errorData = {
      userId: 'user123',
      errors: ['error1', 'error2'],
      timeframe: 'daily' as const
    };

    await tracker.trackErrors(errorData);

    expect(mockPrisma.errorPattern.create).toHaveBeenCalledWith({
      data: {
        userId: errorData.userId,
        errorList: errorData.errors,
        timeframe: errorData.timeframe,
        timestamp: expect.any(Date)
      }
    });
  });
});
