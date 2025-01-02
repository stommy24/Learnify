'use client';

import { useState } from 'react';
import { Timer, CheckCircle, XCircle } from 'lucide-react';

interface PracticeQuestion {
  id: string;
  content: string;
  type: 'multiple-choice' | 'numeric' | 'text';
  options?: string[];
  correctAnswer: string;
  hint?: string;
}

interface PracticeComponentProps {
  questions: PracticeQuestion[];
  onComplete: (results: {
    correct: number;
    total: number;
    timeSpent: number;
  }) => void;
}

export default function PracticeComponent({ 
  questions, 
  onComplete 
}: PracticeComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const timeSpent = (Date.now() - startTime) / 1000;
        setTimeSpent(timeSpent);
        const correct = answers.filter(
          (a, i) => a === questions[i].correctAnswer
        ).length;
        onComplete({ correct, total: questions.length, timeSpent });
      }
    }, 1500);
  };

  const question = questions[currentQuestion];
  const isCorrect = answers[currentQuestion] === question.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Progress */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Timer className="w-4 h-4 mr-1" />
          {Math.floor((Date.now() - startTime) / 1000)}s
        </div>
      </div>

      {/* Question */}
      <div className="prose max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: question.content }} />
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.type === 'multiple-choice' && question.options?.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={showFeedback}
            className={`
              w-full p-4 text-left rounded-lg border-2 transition-all
              ${showFeedback
                ? option === question.correctAnswer
                  ? 'border-green-500 bg-green-50'
                  : option === answers[currentQuestion]
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                : 'border-gray-200 hover:border-blue-500'
              }
            `}
          >
            {option}
          </button>
        ))}

        {question.type === 'numeric' && (
          <input
            type="number"
            placeholder="Enter your answer"
            className="w-full p-4 border-2 rounded-lg"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAnswer((e.target as HTMLInputElement).value);
              }
            }}
          />
        )}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`
          mt-6 p-4 rounded-lg flex items-center
          ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
        `}>
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <XCircle className="w-5 h-5 mr-2" />
          )}
          {isCorrect ? 'Correct!' : `Incorrect. The answer is ${question.correctAnswer}`}
        </div>
      )}
    </div>
  );
} 