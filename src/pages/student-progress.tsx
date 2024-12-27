import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StudentList } from '@/components/students/StudentList';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { SubjectProgress } from '@/components/progress/SubjectProgress';
import { useStudentProgress } from '@/hooks/useStudentProgress';

export default function StudentProgress() {
  const { students, progress, loading, error } = useStudentProgress();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Student Progress</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProgressChart data={progress.overall} />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubjectProgress subject="maths" data={progress.maths} />
              <SubjectProgress subject="english" data={progress.english} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <StudentList 
              students={students}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 
