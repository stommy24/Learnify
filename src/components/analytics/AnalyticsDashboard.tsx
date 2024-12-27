import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setTimeRange, setSelectedSubjects } from '../../features/analytics/analyticsSlice';
import { PerformanceOverview } from './PerformanceOverview';
import { SubjectAnalytics } from './SubjectAnalytics';
import { StudentProgress } from './StudentProgress';
import { TrendAnalysis } from './TrendAnalysis';
import { AnalyticsFilters } from './AnalyticsFilters';
import { ExportReport } from './ExportReport';

export const AnalyticsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    classAnalytics,
    studentAnalytics,
    selectedTimeRange,
    selectedSubjects,
    isLoading
  } = useAppSelector(state => state.analytics);

  useEffect(() => {
    // Fetch analytics data
    fetchAnalyticsData();
  }, [selectedTimeRange, selectedSubjects]);

  const fetchAnalyticsData = async () => {
    try {
      // In a real app, this would fetch from your API
      // const response = await analyticsService.fetchData(selectedTimeRange, selectedSubjects);
      // dispatch(setClassAnalytics(response.classData));
      // dispatch(setStudentAnalytics(response.studentData));
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track student performance and identify areas for improvement
            </p>
          </div>
          <ExportReport />
        </div>

        <AnalyticsFilters
          timeRange={selectedTimeRange}
          subjects={selectedSubjects}
          onTimeRangeChange={(range) => dispatch(setTimeRange(range))}
          onSubjectsChange={(subjects) => dispatch(setSelectedSubjects(subjects))}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <PerformanceOverview
            averageScore={classAnalytics.averageScore}
            attendanceRate={classAnalytics.attendanceRate}
            completionRate={classAnalytics.completionRate}
          />
          
          <TrendAnalysis
            trends={classAnalytics.performanceTrends}
            timeRange={selectedTimeRange}
          />
        </div>

        <div className="mt-8">
          <SubjectAnalytics
            performance={classAnalytics.subjectPerformance}
            selectedSubjects={selectedSubjects}
          />
        </div>

        <div className="mt-8">
          <StudentProgress
            students={Object.values(studentAnalytics)}
            subjects={selectedSubjects}
          />
        </div>
      </div>
    </div>
  );
}; 
