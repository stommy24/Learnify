'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalAchievements: number;
  totalXP: number;
  rank: number;
}

interface AchievementLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

const RANK_ICONS = {
  1: { icon: Trophy, color: 'text-yellow-500' },
  2: { icon: Medal, color: 'text-gray-400' },
  3: { icon: Medal, color: 'text-amber-600' },
};

export default function AchievementLeaderboard({ 
  entries, 
  currentUserId 
}: AchievementLeaderboardProps) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Achievement Leaderboard</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
          className="border rounded p-2"
        >
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="allTime">All Time</option>
        </select>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => {
          const RankIcon = RANK_ICONS[entry.rank as keyof typeof RANK_ICONS]?.icon || Award;
          const rankColor = RANK_ICONS[entry.rank as keyof typeof RANK_ICONS]?.color || 'text-blue-500';

          return (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                entry.userId === currentUserId ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
              }`}
            >
              <div className={`${rankColor}`}>
                <RankIcon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {entry.avatarUrl && (
                    <img
                      src={entry.avatarUrl}
                      alt={entry.username}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="font-semibold">{entry.username}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{entry.totalAchievements} achievements</div>
                <div className="text-sm text-gray-500">{entry.totalXP} XP</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 
