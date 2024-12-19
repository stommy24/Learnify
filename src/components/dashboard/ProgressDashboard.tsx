import React from 'react';
import { useAppSelector } from '../../app/hooks';
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

export const ProgressDashboard: React.FC = () => {
  const progress = useAppSelector(state => state.progress);
  const curriculum = useAppSelector(state => state.curriculum);

  const getSubjectProgress = (subject: 'english' | 'mathematics') => {
    const topics = Object.entries(progress.subjects[subject]);
    return {
      overallMastery: topics.reduce((acc, [_, topic]) => acc + topic.mastery, 0) / 
                      Math.max(topics.length, 1),
      topicsCompleted: topics.filter(([_, topic]) => topic.mastery >= 80).length,
      totalTopics: topics.length,
      recentActivity: progress.recentActivity
        .filter(activity => activity.subject === subject)
        .slice(0, 5)
    };
  };

  const englishProgress = getSubjectProgress('english');
  const mathsProgress = getSubjectProgress('mathematics');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Learning Progress</h1>

      {/* Subject Overview Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">English</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Overall Mastery</span>
              <span className="font-bold">{englishProgress.overallMastery.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Topics Completed</span>
              <span className="font-bold">
                {englishProgress.topicsCompleted} / {englishProgress.totalTopics}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mathematics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Overall Mastery</span>
              <span className="font-bold">{mathsProgress.overallMastery.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Topics Completed</span>
              <span className="font-bold">
                {mathsProgress.topicsCompleted} / {mathsProgress.totalTopics}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Strengths */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Learning Style Strengths</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  type: 'Visual',
                  score: progress.learningStrengths.visualScore
                },
                {
                  type: 'Auditory',
                  score: progress.learningStrengths.auditoryScore
                },
                {
                  type: 'Kinesthetic',
                  score: progress.learningStrengths.kinestheticScore
                },
                {
                  type: 'Reading/Writing',
                  score: progress.learningStrengths.readingWritingScore
                }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {progress.recentActivity.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium">
                  {activity.subject.charAt(0).toUpperCase() + activity.subject.slice(1)} - {activity.topic}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(activity.timestamp).toLocaleDateString()} - {activity.type}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{activity.score}%</p>
                <p className="text-sm text-gray-600">{Math.round(activity.timeSpent / 60)} mins</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 