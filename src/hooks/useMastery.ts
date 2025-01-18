import { useState } from 'react';
import { MasteryProgress } from '@/types/mastery';

interface MasteryAttempt {
  topicId: string;
  correct: boolean;
  timestamp: Date;
}

export function useMastery(topicId: string) {
  const [progress, setProgress] = useState<MasteryProgress | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAttempt = async (data: MasteryAttempt) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mastery/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit attempt');
      }

      const result = await response.json();
      setProgress(result.progress);
      setScore(result.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    progress,
    score,
    isLoading,
    error,
    submitAttempt,
  };
} 