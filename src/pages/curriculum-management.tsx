import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CurriculumUploader } from '@/components/curriculum/CurriculumUploader';
import { CurriculumList } from '@/components/curriculum/CurriculumList';
import { useCurriculum } from '@/hooks/useCurriculum';

export default function CurriculumManagement() {
  const { 
    curriculum, 
    uploadCurriculum, 
    deleteCurriculum, 
    loading, 
    error 
  } = useCurriculum();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Curriculum Management</h1>
        
        <CurriculumUploader
          onUpload={uploadCurriculum}
          loading={loading}
        />
        
        <div className="mt-8">
          <CurriculumList
            curriculum={curriculum}
            onDelete={deleteCurriculum}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </DashboardLayout>
  );
} 
