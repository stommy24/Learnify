import React from 'react';
import { formatDistance } from 'date-fns';
import { Assessment } from '@prisma/client';

interface AssessmentCardProps {
  assessment: Assessment;
  onStart: () => void;
}

export function AssessmentCard({ assessment, onStart }: AssessmentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{assessment.title}</h3>
          <p className="text-gray-600 mt-1">{assessment.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          assessment.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-800' :
          assessment.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {assessment.difficulty}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex space-x-4">
          <span>Duration: {assessment.duration} mins</span>
          <span>Points: {assessment.points}</span>
        </div>
        <span>
          Created {formatDistance(new Date(assessment.createdAt), new Date(), { addSuffix: true })}
        </span>
      </div>

      <button
        onClick={onStart}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Start Assessment
      </button>
    </div>
  );
} 
