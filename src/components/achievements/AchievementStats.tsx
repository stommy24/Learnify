'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Achievement {
  category: string;
  unlockedAt?: Date;
  xpReward: number;
}

interface AchievementStatsProps {
  achievements: Achievement[];
}

export default function AchievementStats({ achievements }: AchievementStatsProps) {
  const stats = useMemo(() => {
    const categoryStats = achievements.reduce((acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          unlocked: 0,
          xpEarned: 0
        };
      }
      acc[category].total++;
      if (achievement.unlockedAt) {
        acc[category].unlocked++;
        acc[category].xpEarned += achievement.xpReward;
      }
      return acc;
    }, {} as Record<string, { total: number; unlocked: number; xpEarned: number }>);

    return categoryStats;
  }, [achievements]);

  const chartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Unlocked',
        data: Object.values(stats).map(s => s.unlocked),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Total',
        data: Object.values(stats).map(s => s.total),
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
      }
    ]
  };

  const xpData = {
    labels: Object.keys(stats),
    datasets: [{
      data: Object.values(stats).map(s => s.xpEarned),
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(245, 158, 11, 0.5)',
        'rgba(239, 68, 68, 0.5)',
      ],
    }]
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold mb-6">Achievement Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4">Progress by Category</h3>
          <Bar data={chartData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-lg font-semibold mb-4">XP Distribution</h3>
          <Doughnut data={xpData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats).map(([category, data]) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{category}</h4>
                <p className="text-sm text-gray-500">
                  {data.unlocked} / {data.total} unlocked
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {data.xpEarned} XP earned
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
