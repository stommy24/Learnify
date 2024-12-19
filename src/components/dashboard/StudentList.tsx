import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { setSelectedStudent } from '../../features/management/managementSlice';
import { StudentSummary } from '../../features/management/managementSlice';

interface StudentListProps {
  students: StudentSummary[];
  filters: any;
  isLoading: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  filters,
  isLoading
}) => {
  const dispatch = useAppDispatch();

  const filteredStudents = students.filter(student => {
    if (filters.yearGroup && student.yearGroup !== filters.yearGroup) return false;
    if (filters.subject && student.subjects[filters.subject].progress < 0) return false;
    if (filters.progressRange) {
      const [min, max] = filters.progressRange;
      if (student.overallProgress < min || student.overallProgress > max) return false;
    }
    return true;
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Students</h2>
      </div>
      <div className="divide-y">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => dispatch(setSelectedStudent(student.id))}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-500">Year {student.yearGroup}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {student.overallProgress}%
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${student.overallProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 