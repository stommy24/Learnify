import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/common/Slider';

interface QuizConfigProps {
  difficulty: number;
  questionCount: number;
  onDifficultyChange: (value: number) => void;
  onQuestionCountChange: (value: number) => void;
}

export const QuizConfigurationInterface: React.FC<QuizConfigProps> = ({
  difficulty,
  questionCount,
  onDifficultyChange,
  onQuestionCountChange,
}) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium">Difficulty Level</label>
        <Slider
          value={[difficulty]}
          onValueChange={(value) => onDifficultyChange(value[0])}
          min={1}
          max={5}
          step={1}
        />
      </div>
      
      <div className="space-y-4">
        <label className="text-sm font-medium">Number of Questions</label>
        <Slider
          value={[questionCount]}
          onValueChange={(value) => onQuestionCountChange(value[0])}
          min={5}
          max={50}
          step={5}
        />
      </div>
    </Card>
  );
}; 