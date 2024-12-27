import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { PerformanceMetrics, EngagementMetrics } from './lib/types';

interface LineChartProps {
  data: PerformanceMetrics;
  title: string;
}

interface BarChartProps {
  data: EngagementMetrics;
  title: string;
}

const CustomLineChart: React.FC<LineChartProps> = ({ data, title }) => (
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
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="#82ca9d"
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#ff7300"
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

const CustomBarChart: React.FC<BarChartProps> = ({ data, title }) => (
  <Box sx={{ width: '100%', height: 400, p: 2 }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="active" fill="#8884d8" />
        <Bar dataKey="completed" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

interface AnalyticsVisualsProps {
  performanceData: PerformanceMetrics;
  engagementData: EngagementMetrics;
}

export const AnalyticsVisuals: React.FC<AnalyticsVisualsProps> = ({
  performanceData,
  engagementData
}) => {
  return (
    <Box>
      <CustomLineChart
        data={performanceData}
        title="Performance Metrics"
      />
      <CustomBarChart
        data={engagementData}
        title="Engagement Metrics"
      />
    </Box>
  );
}; 
