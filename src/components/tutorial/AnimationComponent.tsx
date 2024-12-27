import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAnimationStore } from '@/lib/tutorial/animationSystem';

export function AnimationComponent({ steps }: { steps: any[] }) {
  const {
    currentStep,
    isPlaying,
    setSteps,
    nextStep,
    previousStep,
    play,
    pause,
    reset
  } = useAnimationStore();

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setSteps(steps);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [steps, setSteps]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        nextStep();
      }, steps[currentStep].duration);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, isPlaying, steps, nextStep]);

  return (
    <div className="space-y-6">
      <div className="relative h-80 border rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 p-6"
          >
            {steps[currentStep]?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={isPlaying ? pause : play}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
} 
