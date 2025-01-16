import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PracticeComponent from '@/components/learning/PracticeComponent';
import TopicLesson from '@/components/learning/TopicLesson';
import InteractiveDemonstration from '@/components/learning/InteractiveDemonstration';
import { PracticeService } from '@/services/PracticeService';
import type { PracticeQuestion, PracticeSession } from '@/services/PracticeService';

// Mock the PracticeService
jest.mock('@/services/PracticeService', () => {
  return {
    PracticeService: {
      generatePracticeSession: jest.fn()
    }
  };
});

const mockTopic = {
  id: 'basic-math',
  title: 'Basic Math',
  explanation: 'Learn basic math concepts',
  examples: [
    {
      id: '1',
      content: '2 + 2 = 4',
      solution: 'Adding two numbers'
    }
  ],
  demonstration: 'Here is how to add numbers'
};

const mockDemonstrationSteps = [
  {
    id: '1',
    content: 'First step',
    explanation: 'This is how we do it',
    duration: 5
  }
];

describe('Learning Integration Tests', () => {
  const mockQuestions: PracticeQuestion[] = [
    {
      id: '1',
      content: 'What is 2 + 2?',
      type: 'multiple-choice',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      difficulty: 1,
      topicId: 'basic-math'
    },
    {
      id: '2',
      content: 'Write "hello"',
      type: 'text',
      correctAnswer: 'hello',
      difficulty: 1,
      topicId: 'basic-english'
    }
  ];

  const mockSession: PracticeSession = {
    id: 'session-1',
    userId: 'user-1',
    topicId: 'basic-math',
    questions: mockQuestions,
    startTime: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the complete learning flow', async () => {
    // Mock the service method
    (PracticeService.generatePracticeSession as jest.Mock).mockResolvedValue(mockSession);
    
    const handleComplete = jest.fn();

    render(
      <>
        <TopicLesson 
          topic={mockTopic}
          onComplete={handleComplete}
        />
        <InteractiveDemonstration
          steps={mockDemonstrationSteps}
          onComplete={handleComplete}
        />
        <PracticeComponent
          questions={mockQuestions}
          onComplete={handleComplete}
        />
      </>
    );

    await waitFor(() => {
      expect(screen.getByText('Basic Math')).toBeInTheDocument();
    });

    const nextButton = screen.getByText(/Continue to Examples/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Example 1/i)).toBeInTheDocument();
    });

    for (const question of mockQuestions) {
      await waitFor(() => {
        expect(screen.getByText(question.content)).toBeInTheDocument();
      });

      if (question.type === 'multiple-choice' && question.options) {
        const answerButton = screen.getByText(question.correctAnswer);
        fireEvent.click(answerButton);
      } else {
        const answerInput = screen.getByRole('textbox');
        fireEvent.change(answerInput, { target: { value: question.correctAnswer } });
        fireEvent.keyPress(answerInput, { key: 'Enter', code: 'Enter' });
      }
    }
  });

  it('should handle errors gracefully', async () => {
    // Mock the service method to reject
    (PracticeService.generatePracticeSession as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    const handleError = jest.fn();
    
    render(
      <PracticeComponent
        questions={[]}
        onComplete={handleError}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText(/error loading questions/i)).toBeInTheDocument();
    });
  });
}); 