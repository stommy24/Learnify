import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';

interface ScheduleCardProps {
  schedule: Array<{
    time: string;
    subject: string;
    topic: string;
    duration: string;
  }>;
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium">{item.time}</div>
              <div className="flex-1">
                <p className="font-medium">{item.subject}</p>
                <p className="text-sm text-muted-foreground">{item.topic}</p>
              </div>
              <div className="text-sm text-muted-foreground">{item.duration}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 