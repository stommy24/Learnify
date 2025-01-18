import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import MasteryPage from '@/pages/topics/[topicId]/mastery';
import { useMastery } from '@/hooks/useMastery';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { topicId: '123' },
  }),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: '123' } },
    status: 'authenticated'
  }),
}));

// Mock the useMastery hook
jest.mock('@/hooks/useMastery');

const mockProgress = {
  id: '1',
  studentId: '123',
  skillId: '456',
  consecutiveSuccesses: 0,
  currentLevel: 'NOVICE',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockScore = 85;

describe('MasteryPage', () => {
  beforeEach(() => {
    // Setup default mock implementation
    (useMastery as jest.Mock).mockReturnValue({
      progress: mockProgress,
      score: mockScore,
      isLoading: false,
      error: null,
      submitAttempt: jest.fn(),
    });
  });

  it('renders the mastery page', () => {
    render(<MasteryPage />);
    expect(screen.getByText(/Mastery Progress/i)).toBeInTheDocument();
  });

  it('shows loading state when submitting attempt', async () => {
    (useMastery as jest.Mock).mockReturnValue({
      progress: mockProgress,
      score: mockScore,
      isLoading: true,
      error: null,
      submitAttempt: jest.fn(),
    });

    render(<MasteryPage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error message when submission fails', () => {
    (useMastery as jest.Mock).mockReturnValue({
      progress: null,
      score: 0,
      isLoading: false,
      error: 'Failed to submit attempt',
      submitAttempt: jest.fn(),
    });

    render(<MasteryPage />);
    expect(screen.getByText(/Failed to submit attempt/i)).toBeInTheDocument();
  });

  it('updates score after successful submission', async () => {
    const mockSubmitAttempt = jest.fn();
    (useMastery as jest.Mock).mockReturnValue({
      progress: mockProgress,
      score: mockScore,
      isLoading: false,
      error: null,
      submitAttempt: mockSubmitAttempt,
    });

    render(<MasteryPage />);
    expect(screen.getByText(new RegExp(`${mockScore}`, 'i'))).toBeInTheDocument();
  });

  it('handles attempt submission', async () => {
    const mockSubmitAttempt = jest.fn();
    (useMastery as jest.Mock).mockReturnValue({
      progress: mockProgress,
      score: mockScore,
      isLoading: false,
      error: null,
      submitAttempt: mockSubmitAttempt,
    });

    render(<MasteryPage />);
    const submitButton = screen.getByRole('button', { name: /submit attempt/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitAttempt).toHaveBeenCalled();
    });
  });
}); 