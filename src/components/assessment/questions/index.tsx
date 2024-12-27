import React from 'react';
import { Question } from '@/types/assessment';

interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function MultipleChoiceQuestion({ question, onAnswer, disabled }: QuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.content}</p>
      <div className="space-y-2">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            className={`w-full p-4 text-left rounded-lg border ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function OpenEndedQuestion({ question, onAnswer, disabled }: QuestionProps) {
  const [answer, setAnswer] = React.useState('');

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.content}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={disabled}
        className="w-full p-4 rounded-lg border min-h-[200px]"
        placeholder="Type your answer here..."
      />
      <button
        onClick={() => onAnswer(answer)}
        disabled={disabled || !answer.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
}

export function NumericQuestion({ question, onAnswer, disabled }: QuestionProps) {
  const [answer, setAnswer] = React.useState('');

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.content}</p>
      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={disabled}
        className="w-full p-4 rounded-lg border"
        placeholder="Enter your numeric answer"
      />
      <button
        onClick={() => onAnswer(answer)}
        disabled={disabled || !answer}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
} 
