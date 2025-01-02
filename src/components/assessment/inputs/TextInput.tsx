'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface TextInputProps {
  question: {
    type: 'text' | 'number';
    validation?: {
      pattern?: string;
      min?: number;
      max?: number;
      maxLength?: number;
    };
    instantFeedback?: boolean;
    answer?: string | number;
  };
  onAnswer: (value: string) => void;
  value?: string;
  isMobile: boolean;
}

export default function TextInput({
  question,
  onAnswer,
  value = '',
  isMobile
}: TextInputProps) {
  const [input, setInput] = useState(value);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.inputMode = question.type === 'number' ? 'numeric' : 'text';
    }
  }, [isMobile, question.type]);

  const validateInput = (value: string): boolean => {
    if (!value) return false;
    
    if (question.validation) {
      const { pattern, min, max, maxLength } = question.validation;
      
      if (pattern && !new RegExp(pattern).test(value)) {
        return false;
      }
      
      if (question.type === 'number') {
        const num = parseFloat(value);
        if (min !== undefined && num < min) return false;
        if (max !== undefined && num > max) return false;
      }
      
      if (maxLength && value.length > maxLength) return false;
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    if (question.instantFeedback) {
      setIsValid(validateInput(newValue));
    }
    
    onAnswer(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={inputRef}
          type={question.type === 'number' ? 'number' : 'text'}
          value={input}
          onChange={handleChange}
          className={`
            w-full p-3 border-2 rounded-lg pr-10
            ${isValid === true ? 'border-green-500' : ''}
            ${isValid === false ? 'border-red-500' : ''}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          {...question.validation}
        />
        
        {isValid !== null && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {isValid === false && question.instantFeedback && (
        <p className="text-sm text-red-500">
          Please check your answer and try again
        </p>
      )}
    </div>
  );
} 