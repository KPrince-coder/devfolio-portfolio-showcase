import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCard } from "./SummaryCard";
import { VisitorChart } from "./VisitorChart";
import { BlogAnalytics } from "./BlogAnalytics";
import { DeviceAnalytics } from "./DeviceAnalytics";
import { EngagementMetrics } from "./EngagementMetrics";
import { GeographicHeatmap } from "./GeographicHeatmap";
import { RealTimeVisitors } from "./RealTimeVisitors";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AnalyticsSummaryProps {
  className?: string;
}

interface AnalyticsData {
  visitors: {
    total: number;
    trend: number;
    previousTotal: number;
  };
  pageViews: {
    total: number;
    trend: number;
    previousTotal: number;
  };
  avgSessionDuration: {
    value: string;
    trend: number;
    previousValue: string;
  };
  bounceRate: {
    value: number;
    trend: number;
    previousValue: number;
  };
}

export const AnalyticsSummary = ({ className }: AnalyticsSummaryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    visitors: { total: 0, trend: 0, previousTotal: 0 },
    pageViews: { total: 0, trend: 0, previousTotal: 0 },
    avgSessionDuration: { value: '0m 0s', trend: 0, previousValue: '0m 0s' },
    bounceRate: { value: 0, trend: 0, previousValue: 0 },
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Fetch analytics data from Supabase
        const { data, error: fetchError } = await supabase
          .from('analytics')
          .select('*')
          .eq('time_range', timeRange)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setAnalyticsData({
            visitors: {
              total: data.total_visitors,
              trend: data.visitor_trend,
              previousTotal: data.previous_visitors,
            },
            pageViews: {
              total: data.total_pageviews,
              trend: data.pageview_trend,
              previousTotal: data.previous_pageviews,
            },
            avgSessionDuration: {
              value: data.avg_session_duration,
              trend: data.duration_trend,
              previousValue: data.previous_duration,
            },
            bounceRate: {
              value: data.bounce_rate,
              trend: data.bounce_rate_trend,
              previousValue: data.previous_bounce_rate,
            },
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center text-red-500">
          <p>Error loading analytics data:</p>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="wait">
              <SummaryCard
                title="Total Visitors"
                value={analyticsData.visitors.total.toLocaleString()}
                trend={analyticsData.visitors.trend}
                previousValue={analyticsData.visitors.previousTotal.toLocaleString()}
                icon="users"
                isLoading={isLoading}
              />
              <SummaryCard
                title="Page Views"
                value={analyticsData.pageViews.total.toLocaleString()}
                trend={analyticsData.pageViews.trend}
                previousValue={analyticsData.pageViews.previousTotal.toLocaleString()}
                icon="eye"
                isLoading={isLoading}
              />
              <SummaryCard
                title="Avg. Session Duration"
                value={analyticsData.avgSessionDuration.value}
                trend={analyticsData.avgSessionDuration.trend}
                previousValue={analyticsData.avgSessionDuration.previousValue}
                icon="clock"
                isLoading={isLoading}
              />
              <SummaryCard
                title="Bounce Rate"
                value={`${analyticsData.bounceRate.value}%`}
                trend={-analyticsData.bounceRate.trend}
                previousValue={`${analyticsData.bounceRate.previousValue}%`}
                icon="arrowLeftRight"
                trendInverted
                isLoading={isLoading}
              />
            </AnimatePresence>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisitorChart
              isLoading={isLoading}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
            <DeviceAnalytics isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GeographicHeatmap
              data={[]}
              isLoading={isLoading}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
            <RealTimeVisitors isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VisitorChart
              isLoading={isLoading}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
            <DeviceAnalytics isLoading={isLoading} />
          </div>
          <GeographicHeatmap
            data={[]}
            isLoading={isLoading}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngagementMetrics isLoading={isLoading} />
            <RealTimeVisitors isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <BlogAnalytics isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};