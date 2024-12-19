import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ChildOverviewCardProps {
  child: {
    name: string;
    grade: number;
    progress: number;
    verificationStatus?: string;
  };
}

export function ChildOverviewCard({ child }: ChildOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{child.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Grade: {child.grade}</p>
          <p>Progress: {child.progress}%</p>
          {child.verificationStatus && (
            <p>Status: {child.verificationStatus}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 