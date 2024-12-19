import React from 'react';
import { styled } from '@mui/material/styles';
import { LinearProgress, LinearProgressProps } from '@mui/material';

interface ProgressBarProps extends Omit<LinearProgressProps, 'value'> {
  progress: number;
  className?: string;
}

const StyledProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className,
  ...props 
}) => {
  return (
    <StyledProgress
      variant="determinate"
      value={Math.min(Math.max(progress, 0), 100)}
      className={className}
      {...props}
    />
  );
}; 