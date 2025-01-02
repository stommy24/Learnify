'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface MultipleChoiceProps {
  question: {
    options: {
      id: string;
      content: string;
      isImage?: boolean;
    }[];
    allowMultiple?: boolean;
  };
  onAnswer: (selected: string[]) => void;
  value?: string[];
  isMobile: boolean;
}

export default function MultipleChoice({
  question,
  onAnswer,
  value = [],
  isMobile
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string[]>(value);

  const handleSelect = (optionId: string) => {
    let newSelected: string[];
    
    if (question.allowMultiple) {
      newSelected = selected.includes(optionId)
        ? selected.filter(id => id !== optionId)
        : [...selected, optionId];
    } else {
      newSelected = [optionId];
    }
    
    setSelected(newSelected);
    onAnswer(newSelected);
  };

  return (
    <div className="space-y-3">
      {question.options.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className={`
            w-full p-4 rounded-lg border-2 transition-colors
            flex items-center space-x-3
            ${selected.includes(option.id)
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {selected.includes(option.id) ? (
            <CheckCircle className="w-5 h-5 text-blue-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
          
          <div className="flex-1 text-left">
            {option.isImage ? (
              <img
                src={option.content}
                alt={`Option ${option.id}`}
                className="max-h-32 object-contain"
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: option.content }} />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
} 