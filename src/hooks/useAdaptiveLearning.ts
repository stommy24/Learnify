import { useState, useEffect } from 'react';
import { AdaptiveLearningService } from '@/services/adaptive/AdaptiveLearningService';
import type { LearningStyleMapping, QuestionType } from '@/types/curriculum';

export function useAdaptiveLearning(
  userId: string,
  topicId: string,
  initialDifficulty = 3
) {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [learningStyle, setLearningStyle] = useState<keyof LearningStyleMapping>('visual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adaptiveService = new AdaptiveLearningService();

  useEffect(() => {
    const updateAdaptations = async () => {
      try {
        setIsLoading(true);
        const difficultyAdjustment = await adaptiveService.adjustDifficulty(userId, topicId);
        setDifficulty(prev => Math.max(1, Math.min(5, prev + difficultyAdjustment)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update adaptations');
      } finally {
        setIsLoading(false);
      }
    };

    updateAdaptations();
  }, [userId, topicId]);

  const getAdaptedContent = async (questionType: QuestionType) => {
    try {
      return await adaptiveService.generateAdaptedContent(
        questionType,
        learningStyle,
        difficulty
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate adapted content');
      return null;
    }
  };

  return {
    difficulty,
    learningStyle,
    setLearningStyle,
    getAdaptedContent,
    isLoading,
    error
  };
} 