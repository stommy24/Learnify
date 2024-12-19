import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentProgressProps {
  students: {
    id: string;
    name: string;
    yearGroup: number;
    performanceHistory: {
      subject: string;
      score: number;
      date: string;
    }[];
    averageScore: number;
    attendance: number;
    completionRate: number;
    strengths: string[];
    weaknesses: string[];
    improvement: number;
  }[];
  subjects: string[];
}

export const StudentProgress: React.FC<StudentProgressProps> = ({
  students,
  subjects
}) => {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'improvement'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedStudents = [...students].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'score':
        comparison = b.averageScore - a.averageScore;
        break;
      case 'improvement':
        comparison = b.improvement - a.improvement;
        break;
    }
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Student Progress</h2>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-500">
        <button
          className="col-span-3 flex items-center gap-2"
          onClick={() => handleSort('name')}
        >
          Student
          {sortBy === 'name' && (
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
        <button
          className="col-span-2 flex items-center gap-2"
          onClick={() => handleSort('score')}
        >
          Average Score
          {sortBy === 'score' && (
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
        <button
          className="col-span-2 flex items-center gap-2"
          onClick={() => handleSort('improvement')}
        >
          Improvement
          {sortBy === 'improvement' && (
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
        <div className="col-span-2">Attendance</div>
        <div className="col-span-2">Completion</div>
        <div className="col-span-1">Details</div>
      </div>

      {/* Student List */}
      <div className="divide-y">
        {sortedStudents.map(student => (
          <React.Fragment key={student.id}>
            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
              <div className="col-span-3">
                <div className="font-medium text-gray-900">{student.name}</div>
                <div className="text-sm text-gray-500">Year {student.yearGroup}</div>
              </div>
              <div className="col-span-2">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                  student.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                  student.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {student.averageScore}%
                </div>
              </div>
              <div className="col-span-2">
                <div className={`inline-flex items-center gap-1 ${
                  student.improvement > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {student.improvement > 0 ? '↑' : '↓'}
                  {Math.abs(student.improvement)}%
                </div>
              </div>
              <div className="col-span-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${student.attendance}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {student.attendance}%
                </div>
              </div>
              <div className="col-span-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${student.completionRate}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {student.completionRate}%
                </div>
              </div>
              <button
                onClick={() => setExpandedStudent(
                  expandedStudent === student.id ? null : student.id
                )}
                className="col-span-1 text-blue-600 hover:text-blue-800"
              >
                {expandedStudent === student.id ? 'Hide' : 'Show'}
              </button>
            </div>

            <AnimatePresence>
              {expandedStudent === student.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gray-50"
                >
                  <div className="p-6 space-y-6">
                    {/* Subject Performance */}
                    <div>
                      <h3 className="font-medium mb-4">Subject Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subjects.map(subject => {
                          const subjectData = student.performanceHistory
                            .filter(p => p.subject === subject)
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                          const latestScore = subjectData[0]?.score || 0;

                          return (
                            <div key={subject} className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className="capitalize">{subject}</span>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                  latestScore >= 80 ? 'bg-green-100 text-green-800' :
                                  latestScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {latestScore}%
                                </span>
                              </div>
                              <div className="w-full h-24">
                                {/* Mini trend chart could go here */}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Strengths and Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2 text-green-600">Strengths</h3>
                        <ul className="space-y-1">
                          {student.strengths.map((strength, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 text-red-600">Areas for Improvement</h3>
                        <ul className="space-y-1">
                          {student.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="text-red-500">!</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}; 