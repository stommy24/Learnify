import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { AggregateStatsCard } from '@/components/cards';

interface Child {
  id: string;
  name: string;
  grade: string;
  progress: number;
  // ... other child properties
}

interface ParentDashboardProps {
  children: Child[];
  // ... other props
}

export function ParentDashboard({ children }: ParentDashboardProps) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {children.map((child: Child) => (
        <Card key={child.id}>
          <h3>{child.name}</h3>
          <p>Grade: {child.grade}</p>
          <p>Progress: {child.progress}%</p>
          <Button onClick={() => setSelectedChild(child)}>View Details</Button>
        </Card>
      ))}
      
      {selectedChild && (
        <AggregateStatsCard
          stats={{
            totalLessons: 0,
            completedLessons: 0,
            averageScore: 0,
            streak: 0
          }}
        />
      )}
    </div>
  );
} 
