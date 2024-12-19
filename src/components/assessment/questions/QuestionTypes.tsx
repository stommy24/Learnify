import React from 'react';
import { IconCheck } from '@tabler/icons-react';

interface QuestionTypesProps {
  options: string[];
  selectedOption: string | string[] | null;
  onChange: (option: string | string[]) => void;
}

export const QuestionTypes: React.FC<QuestionTypesProps> = ({
  options,
  selectedOption,
  onChange,
}) => {
  const handleOptionSelect = (option: string) => {
    // If the option is already selected, deselect it
    if (Array.isArray(selectedOption) && selectedOption.includes(option)) {
      onChange(selectedOption.filter(item => item !== option));
    } 
    // If we're dealing with multiple selections
    else if (Array.isArray(selectedOption)) {
      onChange([...selectedOption, option]);
    } 
    // For single selection
    else {
      onChange(option);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleOptionSelect(option)}
          className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100"
        >
          <IconCheck
            className={`h-4 w-4 ${
              selectedOption && (
                Array.isArray(selectedOption)
                  ? selectedOption.includes(option)
                  : selectedOption === option
              )
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          />
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
};

// Additional question type components... 