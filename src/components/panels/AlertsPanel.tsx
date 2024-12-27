import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AlertsPanelProps {
  alerts: Array<{
    id: string;
    type: 'warning' | 'info' | 'error';
    title: string;
    message: string;
  }>;
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={alert.type}>
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
} 
