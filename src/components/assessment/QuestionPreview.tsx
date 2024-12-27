import React from 'react';
import { Card } from '@/components/ui/card';
import { Question } from '@/types/assessment';

interface QuestionPreviewProps {
  question: Question;
  options: string[];
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  options = [],
}) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div dangerouslySetInnerHTML={{ __html: question.text }} />
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span>{index + 1}.</span>
              <span>{option}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}; 


