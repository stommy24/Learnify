import { useState } from 'react';
import type { AssessmentResult, ScoreCard, PerformanceMetrics } from '@/types/assessment';

interface AssessmentResponse {
  result: AssessmentResult;
  scoreCard: ScoreCard;
  metrics: PerformanceMetrics;
}

export function useAssessment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResponse | null>(null);

  const submitAnswer = async (questionId: string, answer: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer })
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    submitAnswer,
    loading,
    error,
    result
  };
} 