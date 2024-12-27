import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Achievement } from '../../features/gamification/achievementsSlice';

export const AchievementsPanel: React.FC = () => {
  const achievements = useAppSelector(state => state.achievements.achievements);

  const renderAchievement = (achievement: Achievement) => (
    <div 
      key={achievement.id}
      className={`p-4 rounded-lg border ${
        achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{achievement.icon}</span>
        <div>
          <h3 className="font-bold">{achievement.title}</h3>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
      </div>
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${(achievement.progress.current / achievement.progress.target) * 100}%`
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {achievement.progress.current} / {achievement.progress.target}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Achievements</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.values(achievements).map(renderAchievement)}
      </div>
    </div>
  );
}; 
