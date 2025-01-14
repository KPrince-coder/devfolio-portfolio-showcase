import { supabase } from '@/integrations/supabase/client';

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
  geoData: Array<{
    country: string;
    value: number;
    code: string;
    trend: number;
  }>;
}

export const trackPageView = async (path: string) => {
  const { error } = await supabase
    .from('page_views')
    .insert([
      {
        path,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      }
    ]);

  if (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
  const { error } = await supabase
    .from('events')
    .insert([
      {
        event_name: eventName,
        properties,
        timestamp: new Date().toISOString(),
      }
    ]);

    if (error) {
      console.error('Error tracking event:', error);
    }
  };

export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    const [dashboardRes, blogStatsRes, geoStatsRes, deviceStatsRes] = await Promise.all([
      supabase.rpc('get_dashboard_analytics', {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date().toISOString(),
      }),
      supabase.rpc('get_blog_performance'),
      supabase.rpc('get_geo_stats'),
      supabase.rpc('get_device_stats')
    ]);

    if (dashboardRes.error) throw new Error(dashboardRes.error.message);
    if (blogStatsRes.error) throw new Error(blogStatsRes.error.message);
    if (geoStatsRes.error) throw new Error(geoStatsRes.error.message);
    if (deviceStatsRes.error) throw new Error(deviceStatsRes.error.message);

    return {
      visitorTrends: dashboardRes.data?.visitorTrends || { dates: [], visitors: [], pageViews: [] },
      blogPerformance: blogStatsRes.data || [],
      deviceStats: deviceStatsRes.data || { desktop: 0, mobile: 0, tablet: 0 },
      geoData: geoStatsRes.data || []
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};