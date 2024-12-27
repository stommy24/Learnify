import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { format } from 'date-fns';

export const UpcomingAssessments: React.FC = () => {
  const { upcomingAssessments } = useAppSelector(state => state.assessments);

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Upcoming Assessments
      </h2>

      <div className="space-y-4">
        {upcomingAssessments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No upcoming assessments
          </p>
        ) : (
          upcomingAssessments.map(assessment => (
            <div
              key={assessment.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {assessment.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {assessment.subject}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {format(new Date(assessment.dueDate), 'MMM d, yyyy')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {assessment.duration} minutes
                  </div>
                </div>
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  assessment.status === 'upcoming'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {assessment.status}
                </span>
                <span className="text-sm text-gray-500">
                  {assessment.totalPoints} points
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 
