import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckIcon, CheckCircleIcon, LightBulbIcon } from './icons';

interface QuizResult {
  correct: number;
  total: number;
  timeSpent: number;
}

interface QuizResultsVisualizationProps {
  results: QuizResult;
}

export const QuizResultsVisualization: React.FC<QuizResultsVisualizationProps> = ({
  results
}) => {
  const percentage = (results.correct / results.total) * 100;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span>Correct Answers: {results.correct}/{results.total}</span>
          </div>
          <div className="flex items-center space-x-2">
            <LightBulbIcon className="h-5 w-5 text-yellow-500" />
            <span>Score: {percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}; 


