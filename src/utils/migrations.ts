import { supabase } from '@/integrations/supabase/client';

type MigrationFunction = 
  | "get_analytics_access" 
  | "get_blog_performance" 
  | "get_dashboard_analytics" 
  | "get_device_stats" 
  | "get_geo_stats" 
  | "increment_blog_view_count" 
  | "increment_comment_count" 
  | "increment_view_count"
  | "create_hobbies_table"
  | "add_hobbies_rls_policies"
  | "create_hobbies_updated_at_trigger";

export const runMigration = async (functionName: MigrationFunction, params?: any) => {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Migration ${functionName} failed:`, error);
    throw error;
  }
};