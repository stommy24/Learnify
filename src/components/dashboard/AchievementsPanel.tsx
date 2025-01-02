import { Achievement } from '@/types/dashboard';
import { Trophy, Star, Clock, Flag } from 'lucide-react';

interface AchievementsPanelProps {
  achievements: {
    recent: Achievement[];
    total: number;
  };
}

const achievementIcons = {
  MASTERY: Trophy,
  STREAK: Star,
  SPEED: Clock,
  MILESTONE: Flag,
};

export default function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
        <span className="text-sm text-gray-500">
          {achievements.total} total
        </span>
      </div>

      <div className="space-y-4">
        {achievements.recent.map((achievement) => {
          const Icon = achievementIcons[achievement.type];
          
          return (
            <div
              key={achievement.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className={`
                p-2 rounded-full
                ${achievement.type === 'MASTERY' && 'bg-yellow-100 text-yellow-600'}
                ${achievement.type === 'STREAK' && 'bg-purple-100 text-purple-600'}
                ${achievement.type === 'SPEED' && 'bg-green-100 text-green-600'}
                ${achievement.type === 'MILESTONE' && 'bg-blue-100 text-blue-600'}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {achievement.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {achievement.description}
                </p>
              </div>

              <span className="text-xs text-gray-400">
                {new Date(achievement.earnedAt).toLocaleDateString()}
              </span>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700">
        View All Achievements
      </button>
    </div>
  );
} 