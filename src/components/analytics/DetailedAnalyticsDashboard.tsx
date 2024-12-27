import React from 'react';
import { usePerformanceTrendAnalyzer } from '@/lib/analytics/PerformanceTrendAnalyzer';
import { Card } from '../common/Card';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsDashboardProps {
  userId: string;
  timeframe?: 'week' | 'month' | 'all';
}

export const DetailedAnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userId,
  timeframe = 'month'
}) => {
  const { analyzeTrends } = usePerformanceTrendAnalyzer();
  const [analysis, setAnalysis] = React.useState<any>(null);

  React.useEffect(() => {
    const loadAnalysis = async () => {
      const result = await analyzeTrends(userId, timeframe);
      setAnalysis(result);
    };
    loadAnalysis();
  }, [userId, timeframe]);

  if (!analysis) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Overall Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysis.performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  name="Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Topic Performance */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Topic Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analysis.trends.byTopic}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <PolarRadiusAxis />
                <Radar
                  name="Performance"
                  dataKey="performance"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Difficulty Distribution */}
        <Card>
          <h3 className="text-lg font-medium mb-4">Difficulty Levels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.trends.byDifficulty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="performance"
                  fill="#4F46E5"
                  name="Success Rate"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium mb-4">Key Insights</h3>
          <ul className="space-y-2">
            {analysis.insights.map((insight: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}; 
