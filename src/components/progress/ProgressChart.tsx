import React from 'react';
import { Line } from 'react-chartjs-2';
import { Progress } from '@prisma/client';

interface ProgressChartProps {
  progress: Progress[];
  timeRange: 'week' | 'month' | 'year';
}

export function ProgressChart({ progress, timeRange }: ProgressChartProps) {
  const chartData = React.useMemo(() => {
    // Process progress data for chart
    const data = processProgressData(progress, timeRange);
    
    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Progress Score',
          data: data.scores,
          fill: false,
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.1
        }
      ]
    };
  }, [progress, timeRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Learning Progress Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
} 