import { render, screen } from '@testing-library/react';
import { MasteryProgress } from '@/components/mastery/MasteryProgress';
import { MasteryProgress as MasteryProgressType, MasteryLevel } from '@/types/mastery';

describe('MasteryProgress', () => {
  const mockProgress: MasteryProgressType = {
    id: '1',
    studentId: '123',
    skillId: '456',
    currentLevel: 'NOVICE' as MasteryLevel,
    consecutiveSuccesses: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    attempts: [
      {
        id: '1',
        studentId: '123',
        skillId: '456',
        score: 85,
        timeSpent: 300,
        errors: ['error1'],
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  };

  it('renders progress information', () => {
    render(<MasteryProgress progress={mockProgress} />);
    // ... test implementation
  });
}); 