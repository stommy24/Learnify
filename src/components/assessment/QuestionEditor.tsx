import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Question } from '@/types/assessment';

interface QuestionEditorProps {
  question: Question;
  onChange: (updatedQuestion: Question) => void;
  onDelete?: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onChange,
  onDelete,
}) => {
  const handleChange = (field: keyof Question, value: string | string[]) => {
    onChange({
      ...question,
      [field]: value,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!question.options) return;
    const newOptions = [...question.options];
    newOptions[index] = value;
    handleChange('options', newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <RichTextEditor
          value={question.text}
          onChange={(value: string) => handleChange('text', value)}
          placeholder="Enter question text..."
        />
      </div>

      {question.type === 'multiple-choice' && question.options?.map((option: string, index: number) => (
        <div key={index} className="flex gap-2">
          <Input
            value={option}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleOptionChange(index, e.target.value)
            }
            placeholder={`Option ${index + 1}`}
          />
        </div>
      ))}

      <div className="space-y-2">
        <Textarea
          value={Array.isArray(question.correctAnswer) 
            ? question.correctAnswer.join('\n') 
            : question.correctAnswer}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
            handleChange('correctAnswer', e.target.value)
          }
          placeholder="Correct answer..."
        />
      </div>
    </div>
  );
}; 