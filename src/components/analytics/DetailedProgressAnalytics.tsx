import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { LearningProgressChart } from './AnalyticsComponents';

interface SkillMetric {
  skill: string;
  proficiency: number;
  recentProgress: number;
  practiceCount: number;
  lastPracticed: Date;
}

interface TimeMetric {
  totalTime: number;
  averageSessionLength: number;
  mostProductiveTime: string;
  sessionsPerWeek: number;
}

export const DetailedProgressAnalytics: React.FC<{
  skills: SkillMetric[];
  timeMetrics: TimeMetric;
  learningTrends: any[]; // Your time-series data
}> = ({ skills, timeMetrics, learningTrends }) => {
  return (
    <div className="space-y-6">
      <Card title="Skill Proficiency">
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.skill} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{skill.skill}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {skill.practiceCount} practices
                  </span>
                  <span className={`text-sm ${
                    skill.recentProgress > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {skill.recentProgress > 0 ? '+' : ''}{skill.recentProgress}%
                  </span>
                </div>
              </div>
              <ProgressBar
                progress={skill.proficiency}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Learning Patterns">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Average Session Length</span>
              <span className="font-medium">
                {Math.round(timeMetrics.averageSessionLength)} mins
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Sessions per Week</span>
              <span className="font-medium">
                {timeMetrics.sessionsPerWeek}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Most Productive Time</span>
              <span className="font-medium">
                {timeMetrics.mostProductiveTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Learning Time</span>
              <span className="font-medium">
                {Math.round(timeMetrics.totalTime / 60)} hours
              </span>
            </div>
          </div>
        </Card>

        <Card title="Learning Trends">
          <LearningProgressChart
            data={{
              daily: learningTrends,
              weekly: [],
              monthly: []
            }}
            timeframe="daily"
          />
        </Card>
      </div>
    </div>
  );
}; 