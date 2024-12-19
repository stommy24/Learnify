import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { SubjectBreakdown } from '@/components/analytics/SubjectBreakdown';
import { TimeSpentAnalysis } from '@/components/analytics/TimeSpentAnalysis';
import { StrengthsWeaknesses } from '@/components/analytics/StrengthsWeaknesses';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="select select-bordered"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PerformanceChart data={analyticsData?.performance} />
          <SubjectBreakdown data={analyticsData?.subjects} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TimeSpentAnalysis data={analyticsData?.timeSpent} />
          <StrengthsWeaknesses data={analyticsData?.strengths} />
        </div>
      </div>
    </MainLayout>
  );
} 