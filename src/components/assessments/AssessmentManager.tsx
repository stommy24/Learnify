import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { AssessmentList } from './AssessmentList';
import { AssessmentEditor } from './AssessmentEditor';
import { SubmissionViewer } from './SubmissionViewer';
import { setCurrentAssessment } from '../../features/assessments/assessmentSlice';

export const AssessmentManager: React.FC = () => {
  const [view, setView] = useState<'list' | 'editor' | 'submissions'>('list');
  const dispatch = useAppDispatch();
  const { currentAssessment, isLoading, error } = useAppSelector(
    state => state.assessments
  );

  const handleCreateNew = () => {
    dispatch(setCurrentAssessment(null));
    setView('editor');
  };

  const handleEditAssessment = (id: string) => {
    dispatch(setCurrentAssessment(id));
    setView('editor');
  };

  const handleViewSubmissions = (id: string) => {
    dispatch(setCurrentAssessment(id));
    setView('submissions');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {view === 'list' && 'Assessments'}
            {view === 'editor' && (currentAssessment ? 'Edit Assessment' : 'Create Assessment')}
            {view === 'submissions' && 'View Submissions'}
          </h1>

          <div className="flex gap-4">
            {view !== 'list' && (
              <button
                onClick={() => setView('list')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to List
              </button>
            )}
            {view === 'list' && (
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create New Assessment
              </button>
            )}
          </div>
        </div>

        {view === 'list' && (
          <AssessmentList
            onEdit={handleEditAssessment}
            onViewSubmissions={handleViewSubmissions}
          />
        )}
        {view === 'editor' && <AssessmentEditor onSave={() => setView('list')} />}
        {view === 'submissions' && <SubmissionViewer />}
      </div>
    </div>
  );
}; 
