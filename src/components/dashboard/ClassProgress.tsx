import React from 'react';
import { StudentSummary } from '../../features/management/managementSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ClassProgressProps {
  students: StudentSummary[];
}

export const ClassProgress: React.FC<ClassProgressProps> = ({ students }) => {
  const subjectAverages = {
    english: students.reduce((acc, student) => 
      acc + student.subjects.english.progress, 0) / students.length,
    mathematics: students.reduce((acc, student) => 
      acc + student.subjects.mathematics.progress, 0) / students.length
  };

  const progressDistribution = {
    needsSupport: students.filter(s => s.overallProgress < 60).length,
    developing: students.filter(s => s.overallProgress >= 60 && s.overallProgress < 75).length,
    meeting: students.filter(s => s.overallProgress >= 75 && s.overallProgress < 90).length,
    exceeding: students.filter(s => s.overallProgress >= 90).length
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">Class Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subject Averages */}
        <div>
          <h3 className="text-lg font-medium mb-4">Subject Averages</h3>
          <div className="space-y-4">
            {Object.entries(subjectAverages).map(([subject, average]) => (
              <div key={subject}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize">{subject}</span>
                  <span>{Math.round(average)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      subject === 'english' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}
                    style={{ width: `${average}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Distribution */}
        <div>
          <h3 className="text-lg font-medium mb-4">Progress Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Needs Support', value: progressDistribution.needsSupport },
                  { name: 'Developing', value: progressDistribution.developing },
                  { name: 'Meeting', value: progressDistribution.meeting },
                  { name: 'Exceeding', value: progressDistribution.exceeding }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value">
                  {[
                    { color: '#EF4444' },  // red
                    { color: '#F59E0B' },  // yellow
                    { color: '#10B981' },  // green
                    { color: '#3B82F6' }   // blue
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Intervention Alerts */}
      {progressDistribution.needsSupport > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-medium">
            Attention Required
          </h4>
          <p className="text-red-600">
            {progressDistribution.needsSupport} student(s) may need additional support.
          </p>
        </div>
      )}
    </div>
  );
}; 
