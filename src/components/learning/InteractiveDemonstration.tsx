'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

interface Step {
  id: string;
  content: string;
  explanation: string;
  duration: number;
}

interface InteractiveDemonstrationProps {
  steps: Step[];
  onComplete: () => void;
}

export default function InteractiveDemonstration({
  steps,
  onComplete
}: InteractiveDemonstrationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying) {
      const step = steps[currentStep];
      const increment = 100 / (step.duration * 10); // 100ms intervals
      
      timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + increment;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [isPlaying, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    } else {
      onComplete();
    }
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const step = steps[currentStep];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: step.content }} />
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <div dangerouslySetInnerHTML={{ __html: step.explanation }} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-1" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-1" /> Play
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center text-gray-600 hover:text-gray-700"
          >
            <RotateCcw className="w-5 h-5 mr-1" /> Reset
          </button>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center text-blue-600 hover:text-blue-700"
          disabled={progress < 100}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
} 