'use client';

import React, { useState } from 'react';
import { Question, QuestionFormat } from '@/types/assessment';
import { DrawingCanvas } from '../assessment/inputs/DrawingCanvas';
import { TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (answer: string | number) => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
}) => {
  const [answer, setAnswer] = useState<string>('');

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    if (question.type === QuestionFormat.NUMERIC) {
      onAnswer(parseFloat(value));
    } else {
      onAnswer(value);
    }
  };

  const renderAnswerInput = () => {
    switch (question.type) {
      case QuestionFormat.MULTIPLE_CHOICE:
        return (
          <RadioGroup
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            {question.options?.map((option, index) => (
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