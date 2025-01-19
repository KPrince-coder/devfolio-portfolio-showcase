import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Users, Eye, Clock, MousePointer, RefreshCw } from "lucide-react";
import { SummaryCard } from "../Analytics/SummaryCard";
import { VisitorChart } from "../Analytics/VisitorChart";
import { BlogAnalytics } from "../Analytics/BlogAnalytics";
import { GeographicHeatmap } from "../Analytics/GeographicHeatmap";
import { DeviceAnalytics } from "../Analytics/DeviceAnalytics";
import { RealTimeVisitors } from "../Analytics/RealTimeVisitors";
import { EngagementMetrics } from "../Analytics/EngagementMetrics";
import { fetchAnalyticsData } from "@/lib/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AnalyticsDashboardManager = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const analytics = await fetchAnalyticsData();
      setData(analytics);
      toast({
        title: "Success",
        description: "Analytics data refreshed successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch analytics data";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const refreshInterval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const summaryCards = [
    {
      title: "Total Visitors",
      value: data?.visitors?.total || 0,
      trend: data?.visitors?.trend || 0,
      icon: <Users className="h-5 w-5 text-white" />,
      color: "bg-indigo-600",
    },
    {
      title: "Page Views",
      value: data?.pageViews?.total || 0,
      trend: data?.pageViews?.trend || 0,
      icon: <Eye className="h-5 w-5 text-white" />,
      color: "bg-pink-600",
    },
    {
      title: "Avg. Session",
      value: data?.session?.average || "0:00",
      trend: data?.session?.trend || 0,
      icon: <Clock className="h-5 w-5 text-white" />,
      color: "bg-orange-600",
    },
    {
      title: "Bounce Rate",
      value: `${data?.bounceRate?.value || 0}%`,
      trend: data?.bounceRate?.trend || 0,
      icon: <MousePointer className="h-5 w-5 text-white" />,
      color: "bg-green-600",
    },
  ];

  if (error) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
      <AnimatePresence mode="wait">
        <motion.div
          key="analytics"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4 sm:space-y-6 p-2 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Analytics Dashboard</h2>
            <Button
              variant="outline"
              onClick={loadAnalytics}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-[300px] sm:h-[400px]" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Skeleton className="h-[250px] sm:h-[300px]" />
                <Skeleton className="h-[250px] sm:h-[300px]" />
              </div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {summaryCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="min-w-[200px]"
                  >
                    <Card className="h-full">
                      <SummaryCard {...card} />
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="min-h-[300px] sm:min-h-[400px]"
                >
                  <Card className="h-full p-4">
                    <VisitorChart
                      data={data?.visitorTrends || { dates: [], visitors: [], pageViews: [] }}
                    />
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="min-h-[300px] sm:min-h-[400px]"
                >
                  <Card className="h-full p-4">
                    <BlogAnalytics posts={data?.blogPerformance || []} />
                  </Card>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="min-h-[300px]"
                >
                  <Card className="h-full p-4">
                    <GeographicHeatmap data={data?.geoData || []} />
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="min-h-[300px]"
                >
                  <Card className="h-full p-4">
                    <DeviceAnalytics
                      data={data?.deviceStats || { desktop: 0, mobile: 0, tablet: 0 }}
                    />
                  </Card>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="lg:col-span-2 min-h-[300px]"
                >
                  <Card className="h-full p-4">
                    <RealTimeVisitors />
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="min-h-[300px]"
                >
                  <Card className="h-full p-4">
                    <EngagementMetrics />
                  </Card>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </ScrollArea>
  );
};
