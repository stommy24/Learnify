'use client';

import { useState } from 'react';
import { DashboardMetrics } from '@/types/dashboard';
import ProgressOverview from './ProgressOverview';
import { CurrentTopicCard } from './CurrentTopicCard';
import AchievementsPanel from './AchievementsPanel';
import LearningPathway from './LearningPathway';

interface DashboardLayoutProps {
  metrics: DashboardMetrics;
}

export default function DashboardLayout({ metrics }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'topics', 'achievements', 'stats'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ProgressOverview 
              progress={metrics.progress}
              performance={metrics.performance}
            />
            <CurrentTopicCard 
              topic={metrics.currentTopic}
            />
            <LearningPathway 
              currentLevel={metrics.progress.currentLevel}
              completedTopics={metrics.progress.completedTopics}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AchievementsPanel 
              achievements={metrics.achievements}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 