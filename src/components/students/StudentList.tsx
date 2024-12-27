import React from 'react';
import { StudentCard } from './StudentCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface StudentListProps {
  students: Array<{
    id: string;
    name: string;
    progress: number;
    lastActive: string;
    subjects: Array<{
      name: string;
      progress: number;
    }>;
  }>;
  loading: boolean;
  error?: string;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  loading,
  error
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Students</h2>
      <div className="divide-y divide-gray-200">
        {students.map(student => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}; 
