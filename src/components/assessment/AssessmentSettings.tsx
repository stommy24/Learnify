import React from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Settings {
  timeLimit: number;
  passingScore: number;
  allowReview: boolean;
  randomizeQuestions: boolean;
}

interface AssessmentSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export const AssessmentSettings: React.FC<AssessmentSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const handleChange = (field: keyof Settings, value: number | boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <Card className="p-6">
      <Typography variant="h6" className="mb-4">
        Assessment Settings
      </Typography>
      <Box className="space-y-4">
        <Box>
          <Typography variant="subtitle2" className="mb-2">
            Time Limit (minutes)
          </Typography>
          <Input
            type="number"
            value={settings.timeLimit}
            onChange={(e) => handleChange('timeLimit', parseInt(e.target.value))}
            min={1}
            className="w-full"
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" className="mb-2">
            Passing Score (%)
          </Typography>
          <Input
            type="number"
            value={settings.passingScore}
            onChange={(e) => handleChange('passingScore', parseInt(e.target.value))}
            min={0}
            max={100}
            className="w-full"
          />
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={settings.allowReview}
              onChange={(e) => handleChange('allowReview', e.target.checked)}
            />
          }
          label="Allow Review"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.randomizeQuestions}
              onChange={(e) => handleChange('randomizeQuestions', e.target.checked)}
            />
          }
          label="Randomize Questions"
        />
      </Box>
    </Card>
  );
}; 


