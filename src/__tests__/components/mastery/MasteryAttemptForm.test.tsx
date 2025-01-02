import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MasteryAttemptForm } from '@/components/mastery/MasteryAttemptForm';

describe('MasteryAttemptForm', () => {
  const mockOnSubmit = jest.fn();
  const props = {
    studentId: '1',
    topicId: '1',
    onSubmit: mockOnSubmit
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits form with correct data', async () => {
    render(<MasteryAttemptForm {...props} />);
    
    fireEvent.change(screen.getByLabelText(/Score/), {
      target: { value: '85' }
    });
    
    fireEvent.change(screen.getByLabelText(/Time Spent/), {
      target: { value: '120' }
    });
    
    fireEvent.click(screen.getByText('Submit Attempt'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          studentId: '1',
          topicId: '1',
          score: 85,
          timeSpent: 120
        })
      );
    });
  });
}); 