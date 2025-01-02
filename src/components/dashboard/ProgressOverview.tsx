'use client';

import { Course, Enrollment, Progress } from '@prisma/client';
import Link from 'next/link';
import { CheckCircle, Circle } from 'lucide-react';

type CourseWithProgress = Course & {
  _count: {
    sections: number;
  };
  enrollments: (Enrollment & {
    progress: Progress[];
  })[];
};

interface ProgressOverviewProps {
  progress: {
    currentLevel: number;
    completedTopics: number;
    totalTopics: number;
    masteryPercentage: number;
  };
  performance: {
    accuracy: number;
    averageSpeed: number;
    streak: number;
    lastActive: Date;
  };
}

export default function ProgressOverview({ progress, performance }: ProgressOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Current Level</div>
          <div className="text-2xl font-bold text-blue-700">{progress.currentLevel}</div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Topics Mastered</div>
          <div className="text-2xl font-bold text-green-700">
            {progress.completedTopics}/{progress.totalTopics}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-600 mb-1">Accuracy</div>
          <div className="text-2xl font-bold text-purple-700">
            {(performance.accuracy * 100).toFixed(1)}%
          </div>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="text-sm text-orange-600 mb-1">Current Streak</div>
          <div className="text-2xl font-bold text-orange-700">{performance.streak} days</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Mastery</span>
          <span>{progress.masteryPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 rounded-full h-2 transition-all duration-500"
            style={{ width: `${progress.masteryPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
} 
