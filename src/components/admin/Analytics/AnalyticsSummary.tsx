import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeOnSite: string;
}

export const AnalyticsSummary = () => {
  const { data: stats } = useQuery<DashboardAnalytics>({
    queryKey: ["analytics-summary"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_analytics', {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date().toISOString()
      });
      
      if (error) throw error;
      return data as DashboardAnalytics;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-4">
        <h3 className="font-medium text-sm text-muted-foreground">Total Views</h3>
        <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-medium text-sm text-muted-foreground">Unique Visitors</h3>
        <p className="text-2xl font-bold">{stats?.uniqueVisitors || 0}</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-medium text-sm text-muted-foreground">Avg. Time on Site</h3>
        <p className="text-2xl font-bold">{stats?.avgTimeOnSite || '0:00'}</p>
      </Card>
    </div>
  );
};