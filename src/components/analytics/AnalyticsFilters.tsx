import React from 'react';
import { motion } from 'framer-motion';

interface AnalyticsFiltersProps {
  timeRange: 'week' | 'month' | 'term' | 'year';
  subjects: string[];
  onTimeRangeChange: (range: 'week' | 'month' | 'term' | 'year') => void;
  onSubjectsChange: (subjects: string[]) => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  timeRange,
  subjects,
  onTimeRangeChange,
  onSubjectsChange
}) => {
  const availableSubjects = [
    'english',
    'mathematics',
    'science',
    'history',
    'geography',
    'art'
  ];

  const timeRanges = [
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: 'term', label: 'This Term' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-4"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Time Range Selector */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value as typeof timeRange)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selector */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSubjects.map(subject => (
              <button
                key={subject}
                onClick={() => {
                  if (subjects.includes(subject)) {
                    onSubjectsChange(subjects.filter(s => s !== subject));
                  } else {
                    onSubjectsChange([...subjects, subject]);
                  }
                }}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors capitalize ${
                  subjects.includes(subject)
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-600'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">Active Filters:</span>
        <span>{timeRanges.find(r => r.value === timeRange)?.label}</span>
        <span>•</span>
        <span>{subjects.length} subjects selected</span>
      </div>
    </motion.div>
  );
}; 
