interface ProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining?: number;
}

export default function ProgressIndicator({ 
  currentQuestion, 
  totalQuestions, 
  timeRemaining 
}: ProgressIndicatorProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Question {currentQuestion} of {totalQuestions}</span>
        {timeRemaining && <span>{timeRemaining}s remaining</span>}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 