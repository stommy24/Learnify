import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface PerformanceCardProps {
  performance: {
    subject: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
    recentTests: Array<{
      date: string;
      score: number;
    }>;
  };
}

export function PerformanceCard({ performance }: PerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{performance.subject}</p>
            <p className="text-2xl font-bold">{performance.score}%</p>
          </div>
          <div className={`text-${performance.trend === 'up' ? 'green' : performance.trend === 'down' ? 'red' : 'yellow'}-500`}>
            {performance.trend === 'up' ? '↑' : performance.trend === 'down' ? '↓' : '→'}
          </div>
        </div>
        <div className="space-y-2">
          {performance.recentTests.map((test, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{test.date}</span>
              <span>{test.score}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
