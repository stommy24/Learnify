import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { QuestionSearch } from '@/components/questions/QuestionSearch';

describe('QuestionSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calls onChange after debounce', async () => {
    const mockOnChange = jest.fn();
    
    await act(async () => {
      render(<QuestionSearch value="" onChange={mockOnChange} />);
    });

    const searchInput = screen.getByRole('searchbox');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'algebra' } });
      jest.advanceTimersByTime(300);
    });

    expect(mockOnChange).toHaveBeenCalledWith('algebra');
  });
}); 
