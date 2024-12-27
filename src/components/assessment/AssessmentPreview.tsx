import React from 'react';
import { Box, Typography } from '@mui/material';
import { Card } from '@/components/ui/card';

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: string | string[];
}

interface AssessmentPreviewProps {
  questions: Question[];
}

export const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ questions }) => {
  return (
    <Card className="p-6">
      <Typography variant="h6" className="mb-4">
        Assessment Preview
      </Typography>
      {questions.map((question, index) => (
        <Box key={question.id} className="mb-6 p-4 border rounded">
          <Typography variant="subtitle1" className="mb-2">
            {index + 1}. {question.text}
          </Typography>
          {question.options && (
            <Box className="ml-4">
              {question.options.map((option, optIndex) => (
                <Typography key={optIndex} className="mb-1">
                  • {option}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      ))}
      {questions.length === 0 && (
        <Typography color="textSecondary">
          No questions added yet. Start by adding some questions.
        </Typography>
      )}
    </Card>
  );
}; 


