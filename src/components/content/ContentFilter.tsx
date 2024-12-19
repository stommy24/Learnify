import React from 'react';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { UserIdentifier } from '@/types/identifiers';

interface ContentFilterProps {
  user: UserIdentifier;
  onFilterChange: (filters: Record<string, string>) => void;
}

export function ContentFilter({ user, onFilterChange }: ContentFilterProps) {
  const [selectedSubject, setSelectedSubject] = React.useState<string>('');
  const [selectedGrade, setSelectedGrade] = React.useState<string>('');

  const subjectOptions: ComboboxOption[] = [
    { label: 'Mathematics', value: 'math' },
    { label: 'English', value: 'english' },
    { label: 'Science', value: 'science' },
  ];

  const gradeOptions: ComboboxOption[] = [
    { label: 'Grade 1', value: '1' },
    { label: 'Grade 2', value: '2' },
    { label: 'Grade 3', value: '3' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'subject') setSelectedSubject(value);
    if (key === 'grade') setSelectedGrade(value);
    onFilterChange({ [key]: value });
  };

  return (
    <div className="space-y-4">
      <Combobox
        options={subjectOptions}
        value={selectedSubject}
        onChange={(value) => handleFilterChange('subject', value)}
        placeholder="Select Subject"
      />
      
      {user.role === 'teacher' && (
        <Combobox
          options={gradeOptions}
          value={selectedGrade}
          onChange={(value) => handleFilterChange('grade', value)}
          placeholder="Select Grade"
        />
      )}
    </div>
  );
} 