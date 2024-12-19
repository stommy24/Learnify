import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionGenerationPage } from '@/pages/questions/generate';
import { QuestionTable } from '@/components/questions/QuestionTable';
import { QuestionSearch } from '@/components/questions/QuestionSearch';
import { mockQuestions, mockFilters } from '../mocks/questionData';

describe('Question Generation System', () => {
  describe('Generation Page', () => {
    it('should handle form submission correctly', async () => {
      render(<QuestionGenerationPage />);
      
      await userEvent.selectOptions(
        screen.getByLabelText(/subject/i),
        'mathematics'
      );
      
      await userEvent.selectOptions(
        screen.getByLabelText(/difficulty/i),
        'medium'
      );
      
      await userEvent.click(screen.getByRole('button', { name: /generate/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/generation started/i)).toBeInTheDocument();
      });
    });

    it('should validate form inputs', async () => {
      render(<QuestionGenerationPage />);
      
      await userEvent.click(screen.getByRole('button', { name: /generate/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/topic is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Question Table', () => {
    it('should render questions correctly', () => {
      render(
        <QuestionTable
          questions={mockQuestions}
          isLoading={false}
          pagination={{ page: 0, pageSize: 10, total: 20 }}
          onPaginationChange={jest.fn()}
        />
      );

      mockQuestions.forEach(question => {
        expect(screen.getByText(question.content)).toBeInTheDocument();
      });
    });

    it('should handle pagination', async () => {
      const onPaginationChange = jest.fn();
      render(
        <QuestionTable
          questions={mockQuestions}
          isLoading={false}
          pagination={{ page: 0, pageSize: 10, total: 20 }}
          onPaginationChange={onPaginationChange}
        />
      );

      await userEvent.click(screen.getByLabelText(/next page/i));
      expect(onPaginationChange).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        total: 20
      });
    });
  });
}); 