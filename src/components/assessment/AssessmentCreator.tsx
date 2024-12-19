import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AssessmentPreview } from './AssessmentPreview';
import { AssessmentSettings } from './AssessmentSettings';
import { useAssessmentCreator } from '@/hooks/useAssessmentCreator';

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: string | string[];
}

interface Settings {
  timeLimit: number;
  passingScore: number;
  allowReview: boolean;
  randomizeQuestions: boolean;
}

export const AssessmentCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [settings, setSettings] = useState<Settings>({
    timeLimit: 60,
    passingScore: 70,
    allowReview: true,
    randomizeQuestions: false,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  const { createAssessment, isLoading } = useAssessmentCreator();

  const handleAddQuestion = (q: Question) => {
    setQuestions([...questions, q]);
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <Box className="space-y-4">
            {questions.map((question, index) => (
              <Box key={question.id} className="p-4 border rounded">
                <Input
                  value={question.text}
                  onChange={(e) => handleUpdateQuestion(index, { ...question, text: e.target.value })}
                  placeholder="Question text"
                />
                <Button
                  onClick={() => {
                    const newQuestions = questions.filter((_, i) => i !== index);
                    setQuestions(newQuestions);
                  }}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button onClick={() => handleAddQuestion({
              id: `q-${questions.length + 1}`,
              text: '',
              type: 'multiple-choice'
            })}>
              Add Question
            </Button>
          </Box>
        </TabsContent>

        <TabsContent value="preview">
          <AssessmentPreview questions={questions} />
        </TabsContent>

        <TabsContent value="settings">
          <AssessmentSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>
      </Tabs>

      <Box className="mt-6">
        <Button
          onClick={() => createAssessment({ questions, settings })}
          disabled={isLoading || questions.length === 0}
        >
          Save Assessment
        </Button>
      </Box>
    </Card>
  );
}; 