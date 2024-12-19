import { useState } from 'react';
import { api } from '@/lib/api';

interface GenerationOptions {
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  correctAnswer: string;
}

interface GenerationResult {
  questions: Question[];
  metadata: {
    generatedAt: string;
    totalCount: number;
  };
}

export function useQuestionGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async (options: GenerationOptions): Promise<GenerationResult | null> => {
    try {
      setLoading(true);
      const response = await api.post<GenerationResult>('/questions/generate', options);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate questions';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateQuestions,
    loading,
    error,
  };
} 