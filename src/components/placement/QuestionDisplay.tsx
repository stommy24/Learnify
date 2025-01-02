'use client';

import { useState, useEffect } from 'react';
import { PlacementQuestion, QuestionType } from '@/types/placement';
import Timer from './Timer';
import ProgressIndicator from './ProgressIndicator';

interface QuestionDisplayProps {
  question: PlacementQuestion;
  onSubmit: (answer: string) => Promise<void>;
  timeStarted: number;
  currentQuestion: number;
  totalQuestions: number;
}

export default function QuestionDisplay({
  question,
  onSubmit,
  timeStarted,
  currentQuestion,
  totalQuestions
}: QuestionDisplayProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        const key = e.key.toLowerCase();
        if (['a', 'b', 'c', 'd'].includes(key)) {
          setAnswer(key.toUpperCase());
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [question.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer) {
      setError('Please provide an answer');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(answer);
      setAnswer('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Timer 
          startTime={timeStarted} 
          className="text-lg text-gray-600"
        />
        <ProgressIndicator 
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{question.content}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {question.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map((option) => (
                <label
                  key={option}
                  className={`block p-3 border rounded-lg cursor-pointer transition-colors
                    ${answer === option ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answer === option}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="mr-2"
                  />
                  {question[`option${option}`]}
                </label>
              ))}
            </div>
          )}

          {question.type === QuestionType.NUMERIC && (
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your numeric answer"
            />
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !answer}
            className={`w-full py-2 px-4 rounded text-white transition-colors
              ${isSubmitting || !answer 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </form>
      </div>
    </div>
  );
} 