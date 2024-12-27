import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  onTimeWarning?: () => void;
  warningThreshold?: number; // in minutes
}

export const QuizSessionTimer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  onTimeWarning,
  warningThreshold = 2
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        // Check for warning threshold
        if (newTime === warningThreshold * 60 && onTimeWarning) {
          setIsWarning(true);
          onTimeWarning();
        }
        
        // Check for time up
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp, onTimeWarning, warningThreshold]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= warningThreshold * 60) {
      return 'text-red-600';
    }
    if (timeLeft <= duration * 60 * 0.25) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ 
            scale: isWarning ? [1, 1.1, 1] : 1,
            transition: { 
              duration: 0.5,
              repeat: isWarning ? Infinity : 0,
              repeatType: "reverse"
            }
          }}
          className={`
            font-mono text-2xl font-bold
            bg-white rounded-lg shadow-lg
            px-4 py-2 border-2
            ${getTimerColor()}
          `}
        >
          {formatTime(timeLeft)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 
