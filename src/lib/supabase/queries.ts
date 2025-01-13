import { supabase } from '@/integrations/supabase/client';

export const fetchVisitorData = async () => {
  const { data, error } = await supabase
    .from('page_views')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchBlogAnalytics = async () => {
  const { data, error } = await supabase
    .from('blog_analytics')
    .select(`
      *,
      blog:blogs(title)
    `);

  if (error) throw error;
  return data;
};

export const fetchGeoData = async () => {
  const { data, error } = await supabase
    .from('page_views')
    .select('country')
    .not('country', 'is', null);

  if (error) throw error;
  return data;
};

export const fetchDeviceData = async () => {
  const { data, error } = await supabase
    .from('page_views')
    .select('device_type')
    .not('device_type', 'is', null);

  if (error) throw error;
  return data;
};
