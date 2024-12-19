import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Assessment, deleteAssessment, setFilters } from '../../features/assessments/assessmentSlice';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface AssessmentListProps {
  onEdit: (id: string) => void;
  onViewSubmissions: (id: string) => void;
}

export const AssessmentList: React.FC<AssessmentListProps> = ({
  onEdit,
  onViewSubmissions
}) => {
  const dispatch = useAppDispatch();
  const { assessments, filters } = useAppSelector(state => state.assessments);
  const [sortBy, setSortBy] = useState<keyof Assessment>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const handleSort = (field: keyof Assessment) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAssessments = Object.values(assessments).filter(assessment => {
    if (filters.subject && assessment.subject !== filters.subject) return false;
    if (filters.yearGroup && assessment.yearGroup !== filters.yearGroup) return false;
    if (filters.status && assessment.status !== filters.status) return false;
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      const date = new Date(assessment.updatedAt);
      if (date < new Date(start) || date > new Date(end)) return false;
    }
    return true;
  });

  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        // In a real app, you would call an API here
        dispatch(deleteAssessment(id));
      } catch (error) {
        console.error('Failed to delete assessment:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="form-select rounded-md border-gray-300"
            value={filters.subject || ''}
            onChange={(e) => dispatch(setFilters({ ...filters, subject: e.target.value || undefined }))}
          >
            <option value="">All Subjects</option>
            <option value="english">English</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
          </select>

          <select
            className="form-select rounded-md border-gray-300"
            value={filters.yearGroup || ''}
            onChange={(e) => dispatch(setFilters({ 
              ...filters, 
              yearGroup: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
          >
            <option value="">All Year Groups</option>
            {[7, 8, 9, 10, 11, 12, 13].map(year => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>

          <select
            className="form-select rounded-md border-gray-300"
            value={filters.status || ''}
            onChange={(e) => dispatch(setFilters({ ...filters, status: e.target.value as Assessment['status'] || undefined }))}
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={() => dispatch(setFilters({}))}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Assessment List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('subject')}
              >
                Subject {sortBy === 'subject' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('yearGroup')}
              >
                Year Group {sortBy === 'yearGroup' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('updatedAt')}
              >
                Last Updated {sortBy === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAssessments.map(assessment => (
              <React.Fragment key={assessment.id}>
                <tr
                  className={`hover:bg-gray-50 ${
                    selectedAssessment === assessment.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedAssessment(
                    selectedAssessment === assessment.id ? null : assessment.id
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assessment.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 capitalize">
                      {assessment.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      Year {assessment.yearGroup}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assessment.status === 'published' ? 'bg-green-100 text-green-800' :
                      assessment.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {assessment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(assessment.updatedAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(assessment.id);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewSubmissions(assessment.id);
                      }}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Submissions
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(assessment.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                <AnimatePresence>
                  {selectedAssessment === assessment.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50"
                    >
                      <td colSpan={6} className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <h3 className="font-medium mb-2">Description</h3>
                          <p className="mb-4">{assessment.description}</p>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium">Duration</h4>
                              <p>{assessment.duration} minutes</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Total Points</h4>
                              <p>{assessment.totalPoints} points</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Passing Score</h4>
                              <p>{assessment.passingScore}%</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 