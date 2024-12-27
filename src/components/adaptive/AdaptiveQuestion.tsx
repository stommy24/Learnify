import { useState, useEffect } from 'react';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';
import type { Question } from '@/types/assessment';
import type { QuestionType } from '@/types/curriculum';
import { LearningStyleSelector } from './LearningStyleSelector';

interface Props {
  question: Question & { type: QuestionType };
  userId: string;
  topicId: string;
  onAnswer: (answer: string) => void;
}

export function AdaptiveQuestion({ question, userId, topicId, onAnswer }: Props) {
  const [answer, setAnswer] = useState('');
  const [adaptedContent, setAdaptedContent] = useState<{
    content: string;
    adaptations: string[];
    scaffolding: string[];
  } | null>(null);

  const {
    difficulty,
    learningStyle,
    setLearningStyle,
    getAdaptedContent,
    isLoading,
    error
  } = useAdaptiveLearning(userId, topicId);

  useEffect(() => {
    const loadAdaptedContent = async () => {
      const content = await getAdaptedContent(question.type);
      if (content) {
        setAdaptedContent(content);
      }
    };
    loadAdaptedContent();
  }, [question, learningStyle, difficulty]);

  if (isLoading) {
    return <div className="animate-pulse">Loading adaptive content...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Difficulty Level: {difficulty}
        </h3>
        <LearningStyleSelector
          current={learningStyle}
          onChange={setLearningStyle}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {adaptedContent && (
          <>
            <div className="prose max-w-none mb-4">
              {adaptedContent.content}
            </div>
            
            {adaptedContent.adaptations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Learning Aids:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {adaptedContent.adaptations.map((aid, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {aid}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Enter your answer..."
              />

              {adaptedContent.scaffolding.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Hints:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {adaptedContent.scaffolding.map((hint, index) => (
                      <li key={index} className="text-sm text-blue-600">
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => onAnswer(answer)}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit Answer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 