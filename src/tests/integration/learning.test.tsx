import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import PracticeComponent from '@/components/learning/PracticeComponent';
import TopicLesson from '@/components/learning/TopicLesson';
import InteractiveDemonstration from '@/components/learning/InteractiveDemonstration';
import { PracticeService } from '@/services/PracticeService';
import { QuestionType } from '@/types/placement';

describe('Learning Components Integration', () => {
  const mockPracticeService = new PracticeService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TopicLesson', () => {
    const mockTopic = {
      id: '1',
      title: 'Test Topic',
      explanation: 'Test explanation',
      examples: [
        { id: '1', content: 'Example 1', solution: 'Solution 1' }
      ],
      demonstration: 'Test demonstration'
    };

    it('progresses through all steps correctly', async () => {
      const onComplete = jest.fn();
      render(<TopicLesson topic={mockTopic} onComplete={onComplete} />);

      // Check initial state
      expect(screen.getByText('Test Topic')).toBeInTheDocument();

      // Progress to examples
      fireEvent.click(screen.getByText('Continue to Examples'));
      expect(screen.getByText('Example 1')).toBeInTheDocument();

      // Show solution
      fireEvent.click(screen.getByText('Show Solution'));
      expect(screen.getByText('Solution 1')).toBeInTheDocument();

      // Progress to demonstration
      fireEvent.click(screen.getByText('Continue to Demonstration'));
      expect(screen.getByText('Test demonstration')).toBeInTheDocument();

      // Complete lesson
      fireEvent.click(screen.getByText('Complete Lesson'));
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('PracticeComponent', () => {
    const mockQuestions: PracticeQuestion[] = [
      {
        id: '1',
        content: 'What is 2 + 2?',
        type: QuestionType.NUMERIC,
        correctAnswer: '4'
      },
      {
        id: '2',
        content: 'Select the correct option',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A'
      }
    ];

    it('handles answers and provides feedback correctly', async () => {
      const onComplete = jest.fn();
      render(<PracticeComponent questions={mockQuestions} onComplete={onComplete} />);

      // Answer first question
      const input = screen.getByPlaceholderText('Enter your answer');
      fireEvent.change(input, { target: { value: '4' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 13 });

      // Check feedback
      await waitFor(() => {
        expect(screen.getByText('Correct!')).toBeInTheDocument();
      });

      // Wait for next question
      await waitFor(() => {
        expect(screen.getByText('Select the correct option')).toBeInTheDocument();
      });

      // Answer second question
      fireEvent.click(screen.getByText('A'));

      // Verify completion
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith({
          correct: 2,
          total: 2,
          timeSpent: expect.any(Number)
        });
      });
    });
  });

  describe('InteractiveDemonstration', () => {
    const mockSteps = [
      {
        id: '1',
        content: 'Step 1',
        explanation: 'Explanation 1',
        duration: 2
      },
      {
        id: '2',
        content: 'Step 2',
        explanation: 'Explanation 2',
        duration: 2
      }
    ];

    it('plays through steps correctly', async () => {
      const onComplete = jest.fn();
      render(<InteractiveDemonstration steps={mockSteps} onComplete={onComplete} />);

      // Start playing
      fireEvent.click(screen.getByText('Play'));

      // Wait for first step to complete
      await waitFor(() => {
        expect(screen.getByText('Next')).not.toBeDisabled();
      }, { timeout: 2100 });

      // Progress to next step
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Step 2')).toBeInTheDocument();

      // Complete demonstration
      await waitFor(() => {
        expect(screen.getByText('Complete')).not.toBeDisabled();
      }, { timeout: 2100 });

      fireEvent.click(screen.getByText('Complete'));
      expect(onComplete).toHaveBeenCalled();
    });
  });
}); 