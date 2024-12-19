'use client';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface XPProgressProps {
  xp: number;
  level: string;
}

const LEVEL_THRESHOLDS = {
  'Beginner': { min: 0, max: 100 },
  'Intermediate': { min: 101, max: 300 },
  'Advanced': { min: 301, max: 600 },
  'Expert': { min: 601, max: 1000 },
  'Master': { min: 1001, max: Infinity },
};

export default function XPProgress({ xp, level }: XPProgressProps) {
  const currentThreshold = LEVEL_THRESHOLDS[level as keyof typeof LEVEL_THRESHOLDS];
  const progress = ((xp - currentThreshold.min) / (currentThreshold.max - currentThreshold.min)) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20">
          <CircularProgressbar
            value={Math.min(progress, 100)}
            text={`${xp}XP`}
            styles={buildStyles({
              textSize: '16px',
              pathColor: '#3b82f6',
              textColor: '#1f2937',
            })}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Current Level</h3>
          <p className="text-2xl font-bold text-blue-600">{level}</p>
          <p className="text-sm text-gray-500">
            {xp} / {currentThreshold.max} XP to next level
          </p>
        </div>
      </div>
    </div>
  );
} 