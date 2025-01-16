import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MasteryAttemptForm } from '@/components/mastery/MasteryAttemptForm';

describe('MasteryAttemptForm', () => {
  it('submits form with correct data', async () => {
    const mockOnSubmit = jest.fn();
    render(<MasteryAttemptForm onSubmit={mockOnSubmit} />);

    // Fill in form fields
    const scoreInput = screen.getByLabelText(/score/i);
    const timeSpentInput = screen.getByLabelText(/time spent/i);

    fireEvent.change(scoreInput, { target: { value: '85' } });
    fireEvent.change(timeSpentInput, { target: { value: '300' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check if onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      score: 85,
      timeSpent: 300,
      studentId: 'default-student-id',
      skillId: 'default-skill-id',
      errors: [],
      completedAt: expect.any(Date)
    });
  });

  it('validates required fields', async () => {
    const mockOnSubmit = jest.fn();
    render(<MasteryAttemptForm onSubmit={mockOnSubmit} />);

    // Submit form without filling in any fields
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check for validation messages
    expect(screen.getByText(/score is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    const mockOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<MasteryAttemptForm onSubmit={mockOnSubmit} />);

    // Fill in form fields
    const scoreInput = screen.getByLabelText(/score/i);
    const timeSpentInput = screen.getByLabelText(/time spent/i);
    fireEvent.change(scoreInput, { target: { value: '85' } });
    fireEvent.change(timeSpentInput, { target: { value: '300' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Check loading state
    expect(submitButton).toHaveAttribute('disabled');
    expect(scoreInput).toHaveAttribute('disabled');
    expect(timeSpentInput).toHaveAttribute('disabled');
    expect(submitButton).toHaveTextContent('Submitting...');

    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).not.toHaveAttribute('disabled');
    });
  });
}); 