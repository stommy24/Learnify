'use client';

import { useState } from 'react';

interface LearningPathwayProps {
  currentLevel: number;
  completedTopics: number;
}

export default function LearningPathway({ 
  currentLevel, 
  completedTopics 
}: LearningPathwayProps) {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Pathway</h2>

      {/* Level Selection */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
              ${level === selectedLevel
                ? 'bg-blue-600 text-white'
                : level <= currentLevel
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }
            `}
          >
            Level {level}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all
              ${i < completedTopics
                ? 'border-green-500 bg-green-50'
                : i === completedTopics
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }
            `}
          >
            <div className="text-sm font-medium mb-1">
              Topic {i + 1}
            </div>
            <div className="text-xs text-gray-500">
              {i < completedTopics ? 'Completed' : i === completedTopics ? 'In Progress' : 'Locked'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 