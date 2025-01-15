import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessageAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    repliedMessages: 0,
    archivedMessages: 0,
    dailyMessageTrend: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Total Messages
        const { count: totalMessages } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact' });

        // Unread Messages
        const { count: unreadMessages } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact' })
          .eq('is_read', false);

        // Replied Messages
        const { count: repliedMessages } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact' })
          .eq('status', 'replied');

        // Archived Messages
        const { count: archivedMessages } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact' })
          .eq('status', 'archived');

        // Daily Message Trend (Last 7 Days)
        const dailyMessageTrend = await fetchDailyMessageTrend();

        setAnalytics({
          totalMessages: totalMessages || 0,
          unreadMessages: unreadMessages || 0,
          repliedMessages: repliedMessages || 0,
          archivedMessages: archivedMessages || 0,
          dailyMessageTrend
        });
      } catch (error) {
        console.error('Error fetching message analytics:', error);
      }
    };

    fetchAnalytics();
    const intervalId = setInterval(fetchAnalytics, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  return analytics;
};

// Helper function to fetch daily message trend
const fetchDailyMessageTrend = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data } = await supabase
    .from('contact_submissions')
    .select('created_at')
    .gte('created_at', sevenDaysAgo.toISOString());

  // Group messages by date
  const dailyTrend = data?.reduce((acc, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format for chart
  return Object.entries(dailyTrend || {}).map(([date, count]) => ({
    date,
    count
  }));
};