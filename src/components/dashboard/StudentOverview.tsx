import React from 'react';
import { StudentSummary } from '../../features/management/managementSlice';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StudentOverviewProps {
  student?: StudentSummary;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ student }) => {
  if (!student) {
    return <div>No student selected</div>;
  }

  return (
    <div className="space-y-8">
      {/* Student Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <p className="text-gray-500">Year {student.yearGroup}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{student.overallProgress}%</div>
            <p className="text-gray-500">Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {(['english', 'mathematics'] as const).map(subject => (
          <div key={subject} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 capitalize">{subject}</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Progress</span>
                <span>{student.subjects[subject].progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${student.subjects[subject].progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Recent Topics</h4>
                <ul className="text-sm space-y-1">
                  {student.subjects[subject].recentTopics.map(topic => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Strengths</h4>
                <ul className="text-sm space-y-1">
                  {student.subjects[subject].strengths.map(strength => (
                    <li key={strength} className="text-green-600">✓ {strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Areas for Improvement</h4>
                <ul className="text-sm space-y-1">
                  {student.subjects[subject].areasForImprovement.map(area => (
                    <li key={area} className="text-red-600">! {area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Progress Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={student.recentActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4F46E5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 
