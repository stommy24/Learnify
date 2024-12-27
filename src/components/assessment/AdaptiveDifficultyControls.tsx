import React from 'react';
import { Slider } from '@/components/common/Slider';

interface AdaptiveDifficultyControlsProps {
  difficulty: number;
  onChange: (value: number[]) => void;
}

export const AdaptiveDifficultyControls: React.FC<AdaptiveDifficultyControlsProps> = ({
  difficulty,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Difficulty Level</label>
      <Slider
        defaultValue={[difficulty]}
        onValueChange={onChange}
        min={1}
        max={10}
        step={1}
        className="w-full"
      />
    </div>
  );
}; 
