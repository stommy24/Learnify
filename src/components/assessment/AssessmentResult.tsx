import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/Progress';
import type { AssessmentResult, ScoreCard, PerformanceMetrics } from '@/types/assessment';

interface Props {
  result: AssessmentResult;
  scoreCard: ScoreCard;
  metrics: PerformanceMetrics;
}

export function AssessmentResult({ result, scoreCard, metrics }: Props) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Assessment Result</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Score</p>
            <Progress value={scoreCard.percentage} max={100} />
            <p className="text-lg font-medium mt-1">
              {scoreCard.totalPoints} / {scoreCard.maxPoints} points
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Correct Answers</p>
            <p className="text-lg font-medium">
              {scoreCard.correctAnswers} / {scoreCard.totalQuestions}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Performance Analysis</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-lg font-medium">{(metrics.averageScore as number).toFixed(1)}%</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Improvement</p>
            <p className="text-lg font-medium">
              {(metrics.improvement as number) > 0 ? '+' : ''}{(metrics.improvement as number).toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Strengths</p>
            <ul className="list-disc list-inside">
              {(metrics.strengths as string[]).map((strength: string, i: number) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm text-gray-500">Areas for Improvement</p>
            <ul className="list-disc list-inside">
              {(metrics.weaknesses as string[]).map((weakness: string, i: number) => (
                <li key={i}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 


