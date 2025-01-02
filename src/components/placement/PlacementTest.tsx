'use client';

import { useState } from 'react';
import { QuestionDisplay } from './QuestionDisplay';
import type { PlacementQuestion } from '@/types/placement';

export function PlacementTest() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(10); // Or however many questions you want
  const [timeStarted] = useState(Date.now());
  const [question, setQuestion] = useState<PlacementQuestion | null>(null);

  const handleSubmit = async (answer: string) => {
    // ... existing submit logic ...
  };

  return question ? (
    <QuestionDisplay
      question={question}
      onSubmit={handleSubmit}
      timeStarted={timeStarted}
      currentQuestion={currentQuestion}
      totalQuestions={totalQuestions}
    />
  ) : (
    <div>Loading...</div>
  );
} 