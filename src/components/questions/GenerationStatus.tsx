import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from "lucide-react";
import { GenerationState } from '@/types/generation';

interface GenerationStatusProps {
  state: GenerationState;
  onRetry?: () => void;
}

export function GenerationStatus({ state, onRetry }: GenerationStatusProps) {
  const getStatusColor = () => {
    switch (state.status) {
      case 'generating':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (state.status === 'generating') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating questions... {state.progress}%</span>
        </div>
        <Progress value={state.progress} className="w-full" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <Alert variant="error">
        <AlertTitle>Generation Failed</AlertTitle>
        <AlertDescription>
          {state.error || 'An unexpected error occurred while generating questions.'}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-blue-500 hover:text-blue-600"
            >
              Try again
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (state.status === 'success') {
    return (
      <Alert variant="default">
        <AlertTitle>Generation Complete</AlertTitle>
        <AlertDescription>
          Successfully generated questions. {state.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${getStatusColor()}`}>
      <span>
        {state.status === 'idle' ? 'Ready to generate' : `${state.progress}% complete`}
      </span>
    </div>
  );
}
