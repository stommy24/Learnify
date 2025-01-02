import { render, screen } from '@testing-library/react';
import MasteryPage from '@/pages/topics/[topicId]/mastery';
import { useMastery } from '@/hooks/useMastery';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useMastery');
jest.mock('@/hooks/useAuth');
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { topicId: '123' }
  })
}));

describe('MasteryPage', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      session: { user: { id: '123' } },
      loading: false
    });

    (useMastery as jest.Mock).mockReturnValue({
      progress: {
        id: '1',
        currentLevel: 'NOVICE',
        consecutiveSuccesses: 0
      },
      loading: false,
      error: null,
      submitAttempt: jest.fn(),
      fetchProgress: jest.fn()
    });
  });

  it('renders mastery progress and form', () => {
    render(<MasteryPage />);
    expect(screen.getByText(/Current Level/)).toBeInTheDocument();
  });
}); 