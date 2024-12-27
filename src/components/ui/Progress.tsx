import React from 'react';

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
}

export function Progress({ value, max, className = '' }: ProgressProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
} 
