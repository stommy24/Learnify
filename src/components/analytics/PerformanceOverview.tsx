import React from 'react';
import { motion } from 'framer-motion';

interface PerformanceOverviewProps {
  averageScore: number;
  attendanceRate: number;
  completionRate: number;
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({
  averageScore,
  attendanceRate,
  completionRate
}) => {
  const metrics = [
    {
      title: 'Class Average',
      value: averageScore,
      suffix: '%',
      color: 'bg-blue-500',
      icon: '📊'
    },
    {
      title: 'Attendance Rate',
      value: attendanceRate,
      suffix: '%',
      color: 'bg-green-500',
      icon: '📅'
    },
    {
      title: 'Completion Rate',
      value: completionRate,
      suffix: '%',
      color: 'bg-purple-500',
      icon: '✓'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Performance Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <div className={`w-12 h-12 rounded-full ${metric.color} flex items-center justify-center text-white font-bold`}>
                {Math.round(metric.value)}%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm">{metric.title}</h3>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${metric.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 
