'use client';

import { motion } from 'framer-motion';
import AchievementProgress from '@/components/achievements/AchievementProgress';

interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  xpReward: number;
  unlockedAt?: Date;
  progress?: number;
  category: string;
  shareMessage: string;
  type: string;
}

interface AchievementsListProps {
  achievements: Achievement[];
}

export default function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <div className="text-sm text-gray-500">
          {achievements.filter(a => a.unlockedAt).length} / {achievements.length} Unlocked
        </div>
      </div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {achievements.map((achievement) => (
          <AchievementProgress
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </motion.div>
    </div>
  );
} 
