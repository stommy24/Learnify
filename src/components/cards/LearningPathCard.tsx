import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';

interface LearningPathCardProps {
  currentModule: {
    title: string;
    progress: number;
    nextLesson: string;
    estimatedTime: string;
  };
}

export function LearningPathCard({ currentModule }: LearningPathCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Learning Path</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">{currentModule.title}</h4>
          <div className="mt-2 h-2 w-full rounded-full bg-secondary">
            <div 
              className="h-full rounded-full bg-primary" 
              style={{ width: `${currentModule.progress}%` }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Next Lesson</p>
          <p className="font-medium">{currentModule.nextLesson}</p>
          <p className="text-sm text-muted-foreground">
            Estimated time: {currentModule.estimatedTime}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 