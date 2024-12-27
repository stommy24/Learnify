'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AchievementProgress from './AchievementProgress';

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
}

interface AchievementsListProps {
  achievements: Achievement[];
}

export default function AchievementsList({ achievements }: AchievementsListProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [sort, setSort] = useState<'name' | 'xpReward' | 'category'>('name');

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === 'unlocked') return achievement.unlockedAt;
    if (filter === 'locked') return !achievement.unlockedAt;
    return true;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'xpReward') return b.xpReward - a.xpReward;
    if (sort === 'category') return a.category.localeCompare(b.category);
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <div className="text-sm text-gray-500">
          {achievements.filter(a => a.unlockedAt).length} / {achievements.length} Unlocked
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'unlocked' | 'locked')}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value="unlocked">Unlocked</option>
          <option value="locked">Locked</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'name' | 'xpReward' | 'category')}
          className="border rounded p-2"
        >
          <option value="name">Sort by Name</option>
          <option value="xpReward">Sort by XP Reward</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {sortedAchievements.map((achievement) => (
          <AchievementProgress
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </motion.div>
    </div>
  );
} 
