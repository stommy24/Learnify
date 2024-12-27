import type { Question } from '@/types/assessment';
import type { QuestionAdaptation } from '@/types/curriculum';

interface Props {
  question: Question;
  adaptation: QuestionAdaptation;
  onAnswer: (answer: string) => void;
}

export function AdaptiveQuestionDisplay({ question, adaptation, onAnswer }: Props) {
  const formatQuestion = () => {
    switch (adaptation.format) {
      case 'visual_diagram':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Placeholder for diagram */}
              <span className="text-gray-500">Question Diagram</span>
            </div>
            <p className="text-lg">{question.template}</p>
          </div>
        );

      case 'audio_narration':
        return (
          <div className="space-y-4">
            <p className="text-lg">{question.template}</p>
            <button 
              className="flex items-center space-x-2 text-blue-500"
              onClick={() => {/* Audio playback logic */}}
            >
              <span>▶</span>
              <span>Listen to question</span>
            </button>
          </div>
        );

      case 'interactive_manipulative':
        return (
          <div className="space-y-4">
            <p className="text-lg">{question.template}</p>
            <div className="p-4 bg-gray-100 rounded-lg">
              {/* Interactive elements would go here */}
              <span className="text-gray-500">Interactive Area</span>
            </div>
          </div>
        );

      default:
        return <p className="text-lg">{question.template}</p>;
    }
  };

  return (
    <div className="space-y-6">
      {formatQuestion()}
      
      <div className="space-y-2">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter your answer"
          onChange={(e) => onAnswer(e.target.value)}
        />
        {question.scaffolding?.map((hint, index) => (
          <div key={index} className="text-sm text-gray-600">
            Hint: {hint.hint}
          </div>
        ))}
      </div>
    </div>
  );
} 