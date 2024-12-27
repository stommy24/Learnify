import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface QuestionFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onReset?: () => void;
}

interface FilterState {
  difficulty: string;
  type: string;
  subjects: string[];
  grade: string;
  keyStage?: string;
}

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All Difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const QUESTION_TYPES = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'open-ended', label: 'Open Ended' },
  { value: 'true-false', label: 'True/False' },
];

const SUBJECTS = [
  { value: 'math', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'english', label: 'English' },
];

const KEY_STAGES = [
  { value: 'ks1', label: 'Key Stage 1' },
  { value: 'ks2', label: 'Key Stage 2' },
  { value: 'ks3', label: 'Key Stage 3' },
  { value: 'ks4', label: 'Key Stage 4' },
];

export function QuestionFilters({ onFilterChange, onReset }: QuestionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    difficulty: 'all',
    type: 'all',
    subjects: [],
    grade: 'all',
    keyStage: 'all',
  });

  const handleDifficultyChange = (value: string) => {
    const newFilters = { ...filters, difficulty: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTypeChange = (value: string) => {
    const newFilters = { ...filters, type: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubjectChange = (checked: boolean, subject: string) => {
    const newSubjects = checked 
      ? [...filters.subjects, subject]
      : filters.subjects.filter(s => s !== subject);
    const newFilters = { ...filters, subjects: newSubjects };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleKeyStageChange = (value: string) => {
    const newFilters = { ...filters, keyStage: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleGradeChange = (value: string) => {
    const newFilters = { ...filters, grade: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: FilterState = {
      difficulty: 'all',
      type: 'all',
      subjects: [],
      grade: 'all',
      keyStage: 'all',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    onReset?.();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Difficulty</h3>
        <RadioGroup value={filters.difficulty} onValueChange={handleDifficultyChange}>
          {DIFFICULTY_OPTIONS.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`difficulty-${option.value}`} />
              <label htmlFor={`difficulty-${option.value}`}>{option.label}</label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Key Stage</h3>
        <Select value={filters.keyStage} onValueChange={handleKeyStageChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select key stage" />
          </SelectTrigger>
          <SelectContent>
            {KEY_STAGES.map(stage => (
              <SelectItem key={stage.value} value={stage.value}>
                {stage.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Question Types</h3>
        {QUESTION_TYPES.map(type => (
          <div key={type.value} className="flex items-center space-x-2">
            <Checkbox
              id={`type-${type.value}`}
              checked={filters.type === type.value}
              onCheckedChange={(checked: boolean) => handleTypeChange(type.value)}
            />
            <label htmlFor={`type-${type.value}`}>{type.label}</label>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Subjects</h3>
        {SUBJECTS.map(subject => (
          <div key={subject.value} className="flex items-center space-x-2">
            <Checkbox
              id={`subject-${subject.value}`}
              checked={filters.subjects.includes(subject.value)}
              onCheckedChange={(checked: boolean) => handleSubjectChange(checked, subject.value)}
            />
            <label htmlFor={`subject-${subject.value}`}>{subject.label}</label>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
} 
