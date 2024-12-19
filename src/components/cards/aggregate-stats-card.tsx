import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface AggregateStatsCardProps {
  stats: {
    totalLessons: number;
    completedLessons: number;
    averageScore: number;
    streak: number;
  };
}

export function AggregateStatsCard({ stats }: AggregateStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Lessons</p>
          <p className="text-2xl font-bold">{stats.totalLessons}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">{stats.completedLessons}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Average Score</p>
          <p className="text-2xl font-bold">{stats.averageScore}%</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-2xl font-bold">{stats.streak} days</p>
        </div>
      </CardContent>
    </Card>
  );
} 