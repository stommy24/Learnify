import { useState } from 'react';
import { AdaptiveQuestion } from '../adaptive/AdaptiveQuestion';
import { AdaptiveFeedback } from '../adaptive/AdaptiveFeedback';
import type { Question, AssessmentResult } from '@/types/assessment';
import type { LearningStyleMapping } from '@/types/curriculum';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  questions: Question[];
  userId: string;
  topicId: string;
  initialLearningStyle: keyof LearningStyleMapping;
  onComplete: (results: AssessmentResult[]) => void;
}

export function AdaptiveAssessmentFlow({
  questions,
  userId,
  topicId,
  initialLearningStyle,
  onComplete
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [learningStyle, setLearningStyle] = useState<keyof LearningStyleMapping>(
    initialLearningStyle
  );

  const handleAnswer = async (answer: string) => {
    const result: AssessmentResult = {
      id: uuidv4(),
      questionId: questions[currentIndex].id,
      question: questions[currentIndex],
      answer,
      score: answer === questions[currentIndex].correctAnswer ? 100 : 0,
      isCorrect: answer === questions[currentIndex].correctAnswer,
      totalQuestions: questions.length,
      correctAnswers: answer === questions[currentIndex].correctAnswer ? 1 : 0,
      timeSpent: 0, // You might want to track this
      timestamp: new Date(),
      feedback: [questions[currentIndex].explanation || 'No explanation available'],
      topicPerformance: []
    };

    setCurrentResult(result);
    setResults([...results, result]);
    setShowFeedback(true);
  };

  const handleFeedbackComplete = () => {
    setShowFeedback(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(results);
    }
  };

  if (currentIndex >= questions.length) {
    return <div>Assessment Complete</div>;
  }

  if (showFeedback && currentResult) {
    return (
      <AdaptiveFeedback
        result={currentResult}
        learningStyle={learningStyle}
        onReviewComplete={handleFeedbackComplete}
      />
    );
  }

  return (
    <AdaptiveQuestion
      question={questions[currentIndex]}
      userId={userId}
      topicId={topicId}
      onAnswer={handleAnswer}
    />
  );
} 