import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressDashboard } from '@/components/dashboard/ProgressDashboard';
import { AssessmentResult } from '@/lib/types/assessment';
import { QuestionType } from '@/lib/types/quiz';

describe('ProgressDashboard', () => {
  const mockResults: AssessmentResult[] = [
    {
      id: '1',
      questionId: 'q1',
      question: {
        id: 'q1',
        text: 'Test question 1',
        type: 'multiple-choice' as QuestionType,
        correctAnswer: 'A',
        difficulty: 1,
        topic: 'math',
        subject: 'mathematics',
        options: ['A', 'B', 'C']
      },
      answer: 'A',
      score: 0.8,
      isCorrect: true,
      timeSpent: 300,
      timestamp: new Date('2024-01-01'),
      totalQuestions: 1,
      currentQuestion: 1,
      completed: true,
      config: {
        topics: ['math'],
        yearGroup: 1,
        term: 1,
        difficulty: 1,
        subject: 'mathematics',
        questionCount: 1,
        allowNavigation: true,
        showFeedback: true,
        adaptiveDifficulty: false,
        questionTypes: ['multiple-choice' as QuestionType]
      }
    },
    {
      id: '2',
      questionId: 'q2',
      question: {
        id: 'q2',
        text: 'Test question 2',
        type: 'multiple-choice' as QuestionType,
        correctAnswer: 'B',
        difficulty: 1,
        topic: 'math',
        subject: 'mathematics',
        options: ['A', 'B', 'C']
      },
      answer: 'A',
      score: 0.6,
      isCorrect: false,
      timeSpent: 240,
      timestamp: new Date('2024-01-02'),
      totalQuestions: 1,
      currentQuestion: 1,
      completed: true,
      config: {
        topics: ['math'],
        yearGroup: 1,
        term: 1,
        difficulty: 1,
        subject: 'mathematics',
        questionCount: 1,
        allowNavigation: true,
        showFeedback: true,
        adaptiveDifficulty: false,
        questionTypes: ['multiple-choice' as QuestionType]
      }
    }
  ];

  test('displays correct average score', () => {
    render(<ProgressDashboard results={mockResults} />);
    const averageScore = screen.getByText('70.0%');
    expect(averageScore).toBeInTheDocument();
  });
}); 