import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnswerValidationSystem } from '@/lib/assessment/validation';
import { useAnimationStore } from '@/lib/tutorial/animationSystem';

export function AssessmentInterface({
  question,
  onSubmit,
  onHelp
}: {
  question: any;
  onSubmit: (answer: any) => void;
  onHelp: () => void;
}) {
  const [answer, setAnswer] = useState('');
  const [working, setWorking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const validator = new AnswerValidationSystem();

  const handleSubmit = async () => {
    setWorking(true);
    try {
      const isValid = await validator.validateMathAnswer(
        { numericAnswer: answer, timeSpent: 0 },
        question.correctAnswer,
        question.level
      );
      onSubmit({ answer, isValid });
    } finally {
      setWorking(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="prose dark:prose-invert">
          <h3>{question.title}</h3>
          <p>{question.content}</p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            disabled={working}
          />

          <div className="flex space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={working || !answer}
              className="flex-1"
            >
              {working ? <LoadingSpinner size="sm" /> : 'Submit Answer'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowHint(true)}
              disabled={working}
            >
              Need Help?
            </Button>
          </div>
        </div>

        {showHint && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm">{question.hint}</p>
          </div>
        )}
      </div>
    </Card>
  );
} 