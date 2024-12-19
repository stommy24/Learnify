import React from 'react';
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from '../common/Card';

interface AnalyticsData {
  timestamp: string;
  value: number;
  category?: string;
}

interface ProgressMetrics {
  daily: AnalyticsData[];
  weekly: AnalyticsData[];
  monthly: AnalyticsData[];
}

export const LearningProgressChart: React.FC<{
  data: ProgressMetrics;
  timeframe: 'daily' | 'weekly' | 'monthly';
}> = ({ data, timeframe }) => {
  return (
    <Card title="Learning Progress">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data[timeframe]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const SubjectPerformanceChart: React.FC<{
  data: AnalyticsData[];
}> = ({ data }) => {
  return (
    <Card title="Subject Performance">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const EngagementMetrics: React.FC<{
  data: {
    timeSpent: number;
    completedItems: number;
    accuracy: number;
    streak: number;
  };
}> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Time Spent">
        <div className="text-3xl font-bold">
          {Math.round(data.timeSpent / 60)} mins
        </div>
      </Card>
      <Card title="Completed Items">
        <div className="text-3xl font-bold">
          {data.completedItems}
        </div>
      </Card>
      <Card title="Accuracy">
        <div className="text-3xl font-bold">
          {data.accuracy}%
        </div>
      </Card>
      <Card title="Learning Streak">
        <div className="text-3xl font-bold">
          {data.streak} days
        </div>
      </Card>
    </div>
  );
};

export const DetailedAnalytics: React.FC<{
  learningPatterns: {
    strongTopics: string[];
    weakTopics: string[];
    recommendedFocus: string[];
  };
}> = ({ learningPatterns }) => {
  return (
    <Card title="Learning Insights">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700">Strong Topics</h4>
          <div className="mt-1 flex flex-wrap gap-2">
            {learningPatterns.strongTopics.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700">Areas for Improvement</h4>
          <div className="mt-1 flex flex-wrap gap-2">
            {learningPatterns.weakTopics.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">Recommended Focus</h4>
          <div className="mt-1 flex flex-wrap gap-2">
            {learningPatterns.recommendedFocus.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}; 