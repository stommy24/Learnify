'use client';

import { useState, useEffect } from 'react';

interface TimerProps {
  startTime: number;
  onTimeUpdate?: (timeSpent: number) => void;
  className?: string;
}

export default function Timer({ startTime, onTimeUpdate, className = '' }: TimerProps) {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeSpent = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(newTimeSpent);
      onTimeUpdate?.(newTimeSpent);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`font-mono ${className}`}>
      {formatTime(timeSpent)}
    </div>
  );
} 