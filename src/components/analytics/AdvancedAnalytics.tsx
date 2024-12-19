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
import { Box, Typography } from '@mui/material';

interface AnalyticsData {
  name: string;
  value: number;
  rank: number;
  index: number;
  payload?: any;
  colors?: string[];
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  depth?: number;
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData[];
  title: string;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ data, title }) => {
  return (
    <Box sx={{ width: '100%', height: 400, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="rank"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}; 