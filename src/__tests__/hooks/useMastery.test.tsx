import { renderHook, act } from '@testing-library/react';
import { useMastery } from '@/hooks/useMastery';
import { MasteryAttempt, MasteryProgress, MasteryLevel } from '@/types/mastery';

describe('useMastery', () => {
  const mockProgress: MasteryProgress = {
    id: '1',
    studentId: '123',
    skillId: '456',
    currentLevel: 'NOVICE' as MasteryLevel,
    consecutiveSuccesses: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAttempt: Omit<MasteryAttempt, 'id' | 'createdAt' | 'updatedAt'> = {
    studentId: '123',
    skillId: '456',
    score: 85,
    timeSpent: 300,
    errors: [],
    completedAt: new Date()
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('submits an attempt successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProgress
    });

    const { result } = renderHook(() => useMastery({ 
      studentId: '123', 
      skillId: '456' 
    }));

    await act(async () => {
      await result.current.submitAttempt(mockAttempt);
    });

    expect(result.current.progress).toEqual(mockProgress);
    expect(result.current.error).toBeNull();
  });

  // ... rest of tests
}); 