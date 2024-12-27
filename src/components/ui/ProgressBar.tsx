import React from 'react';
import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
}

export const ProgressBar = ({ value, className }: ProgressBarProps) => {
  return (
    <div className={cn("w-full h-4 bg-neutral-border rounded-full overflow-hidden", className)}>
      <div 
        className="h-full bg-gradient-to-r from-secondary-main to-secondary-light 
                   transition-all duration-500 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}; 
