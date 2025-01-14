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
    const [dashboardRes, blogStatsRes, deviceStatsRes, geoStatsRes] = await Promise.all([
      supabase.rpc('get_dashboard_analytics', {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date().toISOString(),
      }),
      supabase.rpc('get_blog_performance'),
      supabase.rpc('get_device_stats'),
      supabase.rpc('get_geo_stats')
    ]);

    if (dashboardRes.error) throw dashboardRes.error;
    if (blogStatsRes.error) throw blogStatsRes.error;
    if (deviceStatsRes.error) throw deviceStatsRes.error;
    if (geoStatsRes.error) throw geoStatsRes.error;

    return {
      visitorTrends: dashboardRes.data as AnalyticsData['visitorTrends'],
      blogPerformance: blogStatsRes.data as AnalyticsData['blogPerformance'],
      deviceStats: deviceStatsRes.data as AnalyticsData['deviceStats'],
      geoData: geoStatsRes.data as AnalyticsData['geoData']
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};