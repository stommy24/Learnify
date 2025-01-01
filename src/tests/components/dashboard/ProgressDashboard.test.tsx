import { render, screen } from '@testing-library/react';
import { ProgressDashboard } from '@/components/dashboard/ProgressDashboard';
import { ReactNode } from 'react';
import { AssessmentResult } from '@/lib/types/assessment';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}));

describe('ProgressDashboard', () => {
  const mockResults: AssessmentResult[] = [{
    id: '1',
    questionId: 'q1',
    totalQuestions: 10,
    correctAnswers: 7,
    question: {
      id: 'q1',
      text: 'What is 2+2?',
      correctAnswer: '4',
      difficulty: 1,
      subject: 'math',
      topic: 'arithmetic',
      type: 'multiple-choice'
    },
    answer: '4',
    isCorrect: true,
    score: 7500,
    timeSpent: 1,
    completed: true,
    timestamp: new Date(),
    feedback: ['Correct!'],
    startedAt: new Date(),
    config: {
      timeLimit: 60,
      difficulty: 1,
      topics: ['math'],
      questionCount: 10,
      yearGroup: 10,
      term: 1,
      subject: 'mathematics',
      allowNavigation: true,
      showFeedback: true,
      adaptiveDifficulty: false,
      questionTypes: ['multiple-choice']
    },
    questions: [],
    currentQuestion: 0
  }];

  test('displays correct average score', () => {
    render(<ProgressDashboard results={mockResults} />);
    
    const averageScoreSection = screen.getByText('Average Score').parentElement;
    const scoreElement = averageScoreSection?.querySelector('p');
    expect(scoreElement).toHaveTextContent('750000.0%');
  });

  test('displays total time', () => {
    render(<ProgressDashboard results={mockResults} />);
    
    const totalTimeSection = screen.getByText('Total Time').parentElement;
    const timeElement = totalTimeSection?.querySelector('p');
    expect(timeElement).toHaveTextContent('0 mins');
  });
});