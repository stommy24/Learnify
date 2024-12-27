import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface SubjectPerformance {
  [subject: string]: {
    average: number;
    improvement: number;
    topPerformers: string[];
    needsSupport: string[];
  };
}

interface SubjectAnalyticsProps {
  performance: SubjectPerformance;
  selectedSubjects: string[];
}

export const SubjectAnalytics: React.FC<SubjectAnalyticsProps> = ({
  performance,
  selectedSubjects
}) => {
  const chartData = selectedSubjects.map(subject => ({
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    average: performance[subject]?.average || 0,
    improvement: performance[subject]?.improvement || 0
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Subject Performance</h2>
      
      <div className="h-80 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="average" 
              fill="#4F46E5" 
              name="Class Average"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="improvement" 
              fill="#10B981" 
              name="Improvement"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {selectedSubjects.map(subject => (
          <div key={subject} className="space-y-4">
            <h3 className="font-medium capitalize">{subject}</h3>
            
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Top Performers
              </h4>
              <div className="space-y-2">
                {performance[subject]?.topPerformers.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-green-500">★</span>
                    {student}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Needs Support
              </h4>
              <div className="space-y-2">
                {performance[subject]?.needsSupport.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-red-500">!</span>
                    {student}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
