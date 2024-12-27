import React, { useMemo } from 'react';
import { AssessmentResult } from '@/lib/types/assessment';
import { formatDate } from '@/lib/utils/dateUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressDashboardProps {
  results: AssessmentResult[];
  timeframe?: 'week' | 'month' | 'year';
  showDetails?: boolean;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  results,
  timeframe = 'week',
  showDetails = true
}) => {
  const filteredResults = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeframe) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }

    return results.filter(r => r.timestamp && new Date(r.timestamp) >= cutoff);
  }, [results, timeframe]);

  const stats = useMemo(() => ({
    averageScore: filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length,
    completionRate: filteredResults.filter(r => r.isCorrect).length / filteredResults.length,
    totalTime: filteredResults.reduce((sum, r) => sum + r.timeSpent, 0),
    bySubject: Object.entries(
      filteredResults.reduce((acc, r) => {
        const subject = r.config.subject;
        acc[subject] = acc[subject] || { count: 0, totalScore: 0 };
        acc[subject].count++;
        acc[subject].totalScore += r.score;
        return acc;
      }, {} as Record<string, { count: number; totalScore: number }>)
    ).map(([subject, data]) => ({
      subject,
      averageScore: data.totalScore / data.count
    }))
  }), [filteredResults]);

  const chartData = useMemo(() => 
    filteredResults
      .sort((a, b) => (a.timestamp && b.timestamp ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() : 0))
      .map(r => ({
        date: r.timestamp ? formatDate(r.timestamp) : 'N/A',
        score: r.score * 100
      })),
    [filteredResults]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Average Score</h3>
          <p className="text-3xl font-bold text-blue-600">{(stats.averageScore * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Completion Rate</h3>
          <p className="text-3xl font-bold text-green-600">{(stats.completionRate * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Time</h3>
          <p className="text-3xl font-bold text-purple-600">{Math.round(stats.totalTime / 60)} mins</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Progress Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance by Subject</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.bySubject.map(({ subject, averageScore }) => (
            <div key={subject} className="p-3 border rounded">
              <h4 className="font-medium text-gray-600">{subject}</h4>
              <p className="text-2xl font-bold text-indigo-600">
                {(averageScore * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {showDetails && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.timestamp ? formatDate(result.timestamp) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.config.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(result.score * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round(result.timeSpent / 60)} mins
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 
