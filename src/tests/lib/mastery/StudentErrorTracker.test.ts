import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { StudentErrorTracker } from '@/lib/mastery/StudentErrorTracker';
import { PrismaClient, ErrorPattern } from '@prisma/client';

// Mock Prisma
const mockCreate = jest.fn() as jest.MockedFunction<(args: { data: any }) => Promise<ErrorPattern>>;
const mockPrisma = {
  errorPattern: {
    create: mockCreate
  }
} as unknown as PrismaClient;

describe('StudentErrorTracker', () => {
  let errorTracker: StudentErrorTracker;

  beforeEach(() => {
    errorTracker = new StudentErrorTracker(mockPrisma);
    mockCreate.mockClear();
  });

  it('should save error patterns to database', async () => {
    const testData = {
      userId: 'test-user',
      errors: ['error1', 'error2'],
      timestamp: new Date()
    };

    const mockResponse: ErrorPattern = {
      id: 'test-id',
      userId: testData.userId,
      errorList: testData.errors,
      timestamp: testData.timestamp,
      timeframe: 'daily'
    };

    mockCreate.mockResolvedValueOnce(mockResponse);

    await errorTracker.trackErrors(testData);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        userId: testData.userId,
        errorList: testData.errors,
        timestamp: testData.timestamp
      }
    });
  });
});
