import React from 'react';
import { Card, CardHeader, CardContent, Typography, LinearProgress } from '@mui/material';

interface CurrentTopicCardProps {
  topicName: string;
  progress: number;
  estimatedTimeLeft: string;
}

export const CurrentTopicCard: React.FC<CurrentTopicCardProps> = ({
  topicName,
  progress,
  estimatedTimeLeft,
}) => {
  return (
    <Card>
      <CardHeader title="Current Topic" />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {topicName}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ my: 2 }} 
        />
        <Typography variant="body2" color="text.secondary">
          Estimated time remaining: {estimatedTimeLeft}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CurrentTopicCard; 