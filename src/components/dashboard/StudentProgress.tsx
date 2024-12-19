import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const StudentProgress: React.FC = () => {
  const { subjects, overallProgress } = useAppSelector(state => state.student);

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Progress Overview</h2>
      
      {/* Overall Progress */}
      <div className="mb-8 flex items-center justify-center">
        <div className="w-32 h-32">
          <CircularProgressbar
            value={overallProgress}
            text={`${overallProgress}%`}
            styles={buildStyles({
              pathColor: `#3B82F6`,
              textColor: '#1F2937',
              trailColor: '#E5E7EB'
            })}
          />
        </div>
      </div>

      {/* Subject Progress */}
      <div className="space-y-4">
        {subjects.map(subject => (
          <div key={subject.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                {subject.name}
              </span>
              <span className="text-sm text-gray-500">
                {subject.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 