'use client';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import ShareAchievement from './ShareAchievement';

interface AchievementProgressProps {
  achievement: {
    name: string;
    description: string;
    xpReward: number;
    progress?: number;
    unlockedAt?: Date;
    category: string;
    shareMessage: string;
  };
}

export default function AchievementProgress({ achievement }: AchievementProgressProps) {
  const isUnlocked = !!achievement.unlockedAt;
  const progress = achievement.progress ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        isUnlocked ? 'bg-white border-green-200' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16">
          {isUnlocked ? (
            <CircularProgressbar
              value={100}
              text="✓"
              styles={buildStyles({
                textColor: '#16a34a',
                pathColor: '#16a34a',
                trailColor: '#dcfce7'
              })}
            />
          ) : (
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textColor: '#6b7280',
                pathColor: '#3b82f6',
                trailColor: '#e5e7eb'
              })}
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
              {isUnlocked ? (
                <Award className="w-4 h-4 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>
            {isUnlocked && (
              <ShareAchievement 
                name={achievement.name}
                shareMessage={achievement.shareMessage}
              />
            )}
          </div>
          <span className="text-xs text-blue-600 uppercase tracking-wider">
            {achievement.category}
          </span>
          <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
          {isUnlocked ? (
            <p className="text-sm text-green-600 mt-2">
              Unlocked on {achievement.unlockedAt?.toLocaleDateString()}
            </p>
          ) : (
            <p className="text-sm text-blue-600 mt-2">+{achievement.xpReward} XP</p>
          )}
        </div>
      </div>
    </motion.div>
  );
} 
