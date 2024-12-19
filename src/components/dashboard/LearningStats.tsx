'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LearningStatsProps {
  weeklyProgress: {
    date: string;
    lessonsCompleted: number;
    minutesSpent: number;
  }[];
}

export default function LearningStats({ weeklyProgress }: LearningStatsProps) {
  const data = {
    labels: weeklyProgress.map(day => day.date),
    datasets: [
      {
        label: 'Lessons Completed',
        data: weeklyProgress.map(day => day.lessonsCompleted),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Minutes Spent',
        data: weeklyProgress.map(day => day.minutesSpent),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Learning Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <Bar data={data} options={options} />
    </div>
  );
} 