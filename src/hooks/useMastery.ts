import { useState } from 'react';
import { MasteryAttempt, MasteryProgress } from '@/types/mastery';

interface UseMasteryProps {
  studentId: string;
  skillId: string;
}

export function useMastery({ studentId, skillId }: UseMasteryProps) {
  const [progress, setProgress] = useState<MasteryProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitAttempt = async (attempt: Omit<MasteryAttempt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/mastery/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
      });

      if (!response.ok) {
        throw new Error('Failed to submit attempt');
      }

      const result = await response.json();
      setProgress(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mastery/progress/${studentId}/${skillId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }

      const result = await response.json();
      setProgress(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return {
    progress,
    loading,
    error,
    submitAttempt,
    fetchProgress,
  };
} 