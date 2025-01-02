import React from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';
import { Assessment } from '@/types/assessment';

interface AssessmentProgressProps {
  assessment: Assessment;
  currentQuestion: number;
}

export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  assessment,
  currentQuestion
}) => {
  const totalQuestions = assessment.questions.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Question {currentQuestion + 1} of {totalQuestions}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
}; 