import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalStudents: 0,
      averageProgress: 0,
      questionsGenerated: 0,
      successRate: 0
    },
    trends: {
      learning: [],
      performance: []
    },
    metrics: []
  });
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch overview metrics
      const { data: overviewData, error: overviewError } = await supabase
        .rpc('get_analytics_overview', { time_range: timeRange });

      if (overviewError) throw overviewError;

      // Fetch trend data
      const { data: trendsData, error: trendsError } = await supabase
        .rpc('get_analytics_trends', { time_range: timeRange });

      if (trendsError) throw trendsError;

      setAnalytics({
        overview: overviewData,
        trends: processTrendsData(trendsData),
        metrics: processMetricsData(overviewData, trendsData)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, timeRange, setTimeRange, loading, error };
}; 