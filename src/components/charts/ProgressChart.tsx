import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ProgressChartProps {
  data: Array<{
    date: string;
    progress: number;
    target: number;
  }>;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#8884d8"
            name="Progress"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#82ca9d"
            name="Target"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 