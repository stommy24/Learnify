import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  prefix?: string;
  suffix?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const ChangeIndicator = styled(Box)<{ trend: 'positive' | 'negative' | 'neutral' }>(
  ({ theme, trend }) => ({
    display: 'flex',
    alignItems: 'center',
    color:
      trend === 'positive'
        ? theme.palette.success.main
        : trend === 'negative'
        ? theme.palette.error.main
        : theme.palette.text.secondary,
  })
);

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  prefix = '',
  suffix = '',
}) => {
  const trend = change
    ? change > 0
      ? 'positive'
      : change < 0
      ? 'negative'
      : 'neutral'
    : 'neutral';

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {prefix}
          {value}
          {suffix}
        </Typography>
        {change !== undefined && (
          <ChangeIndicator trend={trend}>
            {trend === 'positive' ? (
              <TrendingUpIcon fontSize="small" />
            ) : trend === 'negative' ? (
              <TrendingDownIcon fontSize="small" />
            ) : null}
            <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
              {Math.abs(change)}%
            </Typography>
          </ChangeIndicator>
        )}
      </CardContent>
    </StyledCard>
  );
}; 
