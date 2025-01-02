'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlacementQuestion, PlacementTestStatus, PlacementTestResult } from '@/types/placement';
import QuestionDisplay from './QuestionDisplay';
import LoadingState from './LoadingState';
import ResultsSummary from './ResultsSummary';
import ErrorDisplay from '../common/ErrorDisplay';

interface Props {
  testId: string;
}

export default function PlacementTest({ testId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<PlacementTestStatus>(PlacementTestStatus.IN_PROGRESS);
  const [currentQuestion, setCurrentQuestion] = useState<PlacementQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<PlacementTestResult | undefined>();

  useEffect(() => {
    fetchNextQuestion();
  }, [testId]);

  const fetchNextQuestion = async () => {
    try {
      const response = await fetch(`/api/placement/${testId}/next`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch next question');
      }

      if (data.status === PlacementTestStatus.COMPLETED) {
        setStatus(PlacementTestStatus.COMPLETED);
        return;
      }

      setCurrentQuestion(data.question);
      setStartTime(Date.now());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleSubmit = async (answer: string) => {
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      const response = await fetch(`/api/placement/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion?.id,
          answer,
          timeSpent
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit answer');
      }

      await fetchNextQuestion();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchNextQuestion} />;
  }

  if (!currentQuestion && status !== PlacementTestStatus.COMPLETED) {
    return <LoadingState />;
  }

  if (status === PlacementTestStatus.COMPLETED) {
    return <ResultsSummary 
      testId={testId} 
      result={result}
      onClose={() => router.push('/dashboard')}
    />;
  }

  return (
    <QuestionDisplay
      question={currentQuestion!}
      onSubmit={handleSubmit}
      timeStarted={startTime}
    />
  );
} 