import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const GradeOverview: React.FC = () => {
  const { grades, subjects } = useAppSelector(state => state.student);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredGrades = selectedSubject === 'all'
    ? grades
    : grades.filter(grade => grade.subject === selectedSubject);

  const calculateAverage = (grades: typeof filteredGrades) => {
    if (grades.length === 0) return 0;
    return Math.round(
      grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Grade Overview</h2>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grade Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 mb-1">Average Grade</div>
          <div className="text-2xl font-semibold text-blue-900">
            {calculateAverage(filteredGrades)}%
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 mb-1">Highest Grade</div>
          <div className="text-2xl font-semibold text-green-900">
            {Math.max(...filteredGrades.map(g => g.score))}%
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 mb-1">Total Assessments</div>
          <div className="text-2xl font-semibold text-purple-900">
            {filteredGrades.length}
          </div>
        </div>
      </div>

      {/* Grade Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredGrades}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => [`${value}%`]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Grades */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Recent Grades</h3>
        <div className="space-y-2">
          {filteredGrades.slice(0, 5).map(grade => (
            <div
              key={grade.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900">{grade.title}</div>
                <div className="text-sm text-gray-500">{grade.subject}</div>
              </div>
              <div className={`text-lg font-semibold ${
                grade.score >= 70
                  ? 'text-green-600'
                  : grade.score >= 60
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {grade.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 