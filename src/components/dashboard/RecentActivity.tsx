import { useState } from 'react';
import { StudentSummary, Activity } from '../../features/management/managementSlice';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  studentSummary: StudentSummary;
}

export function RecentActivity({ studentSummary }: RecentActivityProps) {
  const [displayCount, setDisplayCount] = useState(5);

  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'quiz':
        return '📝';
      case 'assignment':
        return '📚';
      case 'lesson':
        return '📖';
      case 'practice':
        return '⭐';
      default:
        return '📌';
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-yellow-500';
      case 'pending':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Activity</h2>
      <div className="space-y-2">
        {studentSummary.recentActivities
          .slice(0, displayCount)
          .map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getActivityIcon(activity)}</span>
                <div>
                  <h3 className="font-medium">{activity.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {activity.score !== undefined && (
                  <span className="font-medium">{activity.score}%</span>
                )}
                <span className={`text-sm ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
      </div>
      {studentSummary.recentActivities.length > displayCount && (
        <button
          onClick={() => setDisplayCount(prev => prev + 5)}
          className="w-full py-2 text-sm text-blue-500 hover:text-blue-600"
        >
          Show More
        </button>
      )}
    </div>
  );
} 
