import React from 'react';
import { Grid } from '@mui/material';
import { MetricCard } from './MetricCard';

interface AnalyticsOverviewProps {
  metrics: {
    title: string;
    value: number | string;
    change?: number;
    prefix?: string;
    suffix?: string;
  }[];
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ metrics }) => {
  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
}; 