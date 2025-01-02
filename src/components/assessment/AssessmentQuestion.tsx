import React from 'react';
import { AssessmentQuestion as QuestionType } from '@/types/assessment';

interface Props {
  question: QuestionType;
  onSubmit: (answer: string, timeSpent: number) => void;
}

export const AssessmentQuestion: React.FC<Props> = ({ question, onSubmit }) => {
  const [answer, setAnswer] = React.useState('');
  const [startTime] = React.useState(Date.now());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onSubmit(answer, timeSpent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">{question.content}</h3>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Your answer..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Submit Answer
      </button>
    </form>
  );
}; 