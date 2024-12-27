import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateSubmission } from '../../features/assessments/assessmentSlice';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { submitGrade } from '../../services/assessmentService';

export const SubmissionViewer: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentAssessmentId = useAppSelector(state => state.assessments.currentAssessment);
  const assessment = useAppSelector(
    state => currentAssessmentId ? state.assessments.assessments[currentAssessmentId] : null
  );
  const submissions = useAppSelector(state => Object.values(state.assessments.submissions)
    .filter(sub => sub.assessmentId === currentAssessmentId)
  );

  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    scoreRange: 'all',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState<'submittedAt' | 'score' | 'studentId'>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [error, setError] = useState<string | null>(null);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filters.status !== 'all' && submission.status !== filters.status) return false;
    if (filters.scoreRange !== 'all') {
      const score = submission.score || 0;
      switch (filters.scoreRange) {
        case 'failing':
          if (score >= (assessment?.passingScore || 60)) return false;
          break;
        case 'passing':
          if (score < (assessment?.passingScore || 60)) return false;
          break;
        case '90plus':
          if (score < 90) return false;
          break;
      }
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      if (!submission.studentId.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'submittedAt':
        comparison = new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        break;
      case 'score':
        comparison = (b.score || 0) - (a.score || 0);
        break;
      case 'studentId':
        comparison = a.studentId.localeCompare(b.studentId);
        break;
    }
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  const handleGrade = async (submissionId: string, score: number, feedback: string) => {
    try {
      await submitGrade(submissionId, { score, feedback });
      dispatch(updateSubmission({ submissionId, score, feedback }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit grade');
    }
  };

  if (!assessment) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{assessment.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Submissions:</span>
            <span className="ml-2 font-medium">{submissions.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Average Score:</span>
            <span className="ml-2 font-medium">
              {Math.round(
                submissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / submissions.length
              )}%
            </span>
          </div>
          <div>
            <span className="text-gray-500">Passing Score:</span>
            <span className="ml-2 font-medium">{assessment.passingScore}%</span>
          </div>
          <div>
            <span className="text-gray-500">Pass Rate:</span>
            <span className="ml-2 font-medium">
              {Math.round(
                (submissions.filter(sub => (sub.score || 0) >= assessment.passingScore).length /
                submissions.length) * 100
              )}%
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="grading">Grading</option>
              <option value="graded">Graded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Score Range</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filters.scoreRange}
              onChange={(e) => setFilters({ ...filters, scoreRange: e.target.value })}
            >
              <option value="all">All Scores</option>
              <option value="failing">Failing</option>
              <option value="passing">Passing</option>
              <option value="90plus">90% and above</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search by student ID..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('studentId')}
              >
                Student {sortBy === 'studentId' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('submittedAt')}
              >
                Submitted {sortBy === 'submittedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('score')}
              >
                Score {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSubmissions.map(submission => (
              <React.Fragment key={submission.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {submission.studentId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.score !== undefined && (
                      <div className={`text-sm font-medium ${
                        submission.score >= assessment.passingScore
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {submission.score}%
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      submission.status === 'graded'
                        ? 'bg-green-100 text-green-800'
                        : submission.status === 'grading'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedSubmission(
                        selectedSubmission === submission.id ? null : submission.id
                      )}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {selectedSubmission === submission.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>

                <AnimatePresence>
                  {selectedSubmission === submission.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <SubmissionDetail
                          submission={submission}
                          assessment={assessment}
                          onGrade={handleGrade}
                        />
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
