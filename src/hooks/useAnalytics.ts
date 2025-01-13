import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsAccess {
  can_view: boolean;
  can_edit: boolean;
}

interface AnalyticsData {
  visitorTrends: {
    dates: string[];
    visitors: number[];
    pageViews: number[];
  };
  blogPerformance: Array<{
    title: string;
    views: number;
    likes: number;
    comments: number;
  }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      // Check access first
      const { data: access, error: accessError } = await supabase
        .rpc('get_analytics_access') as { data: AnalyticsAccess | null, error: any };

      if (accessError) throw accessError;
      if (!access?.can_view) {
        throw new Error('No access to analytics');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      // Get analytics data
      const { data, error: dataError } = await supabase
        .rpc('get_dashboard_analytics', {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        }) as { data: AnalyticsData | null, error: any };

      if (dataError) throw dataError;
      if (!data) throw new Error('No data returned');

      setAnalyticsData(data);
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return { 
    analyticsData, 
    loading, 
    error, 
    refetch: fetchAnalyticsData 
  };
};
