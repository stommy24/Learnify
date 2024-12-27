import { useEffect, useState } from 'react';
import type { AssessmentResult } from '@/types/assessment';
import type { LearningStyleMapping } from '@/types/curriculum';

interface Props {
  result: AssessmentResult;
  learningStyle: keyof LearningStyleMapping;
  onReviewComplete: () => void;
}

export function AdaptiveFeedback({ result, learningStyle, onReviewComplete }: Props) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);

  const getFeedbackStyle = () => {
    switch (learningStyle) {
      case 'visual':
        return {
          component: 'diagram',
          emphasis: 'color-coded explanations'
        };
      case 'auditory':
        return {
          component: 'audio',
          emphasis: 'verbal explanations'
        };
      case 'kinesthetic':
        return {
          component: 'interactive',
          emphasis: 'practice exercises'
        };
      case 'readingWriting':
        return {
          component: 'text',
          emphasis: 'written explanations'
        };
    };
  };

  useEffect(() => {
    if (reviewComplete) {
      onReviewComplete();
    }
  }, [reviewComplete, onReviewComplete]);

  const feedbackStyle = getFeedbackStyle();

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            result.isCorrect ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <h3 className="text-lg font-medium">
            {result.isCorrect ? 'Correct!' : 'Not Quite Right'}
          </h3>
        </div>
        <span className="text-sm text-gray-500">
          Score: {result.score ?? 0}%
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="prose max-w-none">
            <p>{result.feedback}</p>
          </div>
        </div>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-blue-500 hover:text-blue-600"
        >
          {showExplanation ? 'Hide' : 'Show'} Detailed Explanation
        </button>

        {showExplanation && (
          <div className="mt-4 space-y-4">
            {feedbackStyle.component === 'diagram' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                {/* Placeholder for visual explanation */}
                <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  Visual Explanation
                </div>
              </div>
            )}

            {feedbackStyle.component === 'audio' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <button className="flex items-center space-x-2 text-blue-500">
                  <span>▶</span>
                  <span>Listen to Explanation</span>
                </button>
              </div>
            )}

            {feedbackStyle.component === 'interactive' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Practice Exercise</h4>
                <div className="space-y-2">
                  {/* Placeholder for interactive elements */}
                  <div className="p-4 border rounded">
                    Interactive Practice Component
                  </div>
                </div>
              </div>
            )}

            {feedbackStyle.component === 'text' && (
              <div className="prose max-w-none">
                <h4>Detailed Explanation</h4>
                <p>{result.feedback}</p>
                {result.mistakePatterns?.map((pattern, index) => (
                  <div key={index} className="mt-2">
                    <strong>Common Mistake Pattern:</strong>
                    <p>{pattern}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setReviewComplete(true)}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 