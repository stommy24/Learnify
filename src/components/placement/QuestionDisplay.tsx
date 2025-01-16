'use client';

import React, { useState } from 'react';
import { DrawingCanvas } from '../assessment/inputs/DrawingCanvas';
import { TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { PlacementQuestion } from '@/types/placement';
import { QuestionFormat } from '@/types/question';

interface QuestionDisplayProps {
  question: PlacementQuestion;
  onSubmit: (answer: string) => Promise<void>;
  timeStarted: number;
  currentQuestion: number;
  totalQuestions: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onSubmit,
  timeStarted,
  currentQuestion,
  totalQuestions,
}) => {
  const [answer, setAnswer] = useState<string>('');

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    onSubmit(value);
  };

  const renderAnswerInput = () => {
    switch (question.type) {
      case QuestionFormat.MULTIPLE_CHOICE:
        return (
          <RadioGroup
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            {question.options?.map((option: string, index: number) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        );

      case QuestionFormat.TEXT_INPUT:
        return (
          <TextField
            fullWidth
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            variant="outlined"
          />
        );

      case QuestionFormat.DRAWING:
        return (
          <DrawingCanvas
            width={400}
            height={400}
            onComplete={handleAnswerChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h3>{question.content}</h3>
      {renderAnswerInput()}
    </div>
  );
}; 