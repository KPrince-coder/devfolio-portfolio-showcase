import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Users, Eye, Clock, MousePointer } from "lucide-react";
import { SummaryCard } from './SummaryCard';
import { VisitorChart } from './VisitorChart';
import { BlogAnalytics } from './BlogAnalytics';
import { GeographicHeatmap } from './GeographicHeatmap';
import { DeviceAnalytics } from './DeviceAnalytics';
import { RealTimeVisitors } from './RealTimeVisitors';
import { EngagementMetrics } from './EngagementMetrics';
import { fetchAnalyticsData } from '@/lib/analytics';
import { Skeleton } from "@/components/ui/skeleton";


export const AnalyticsDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const analytics = await fetchAnalyticsData();
        setData(analytics);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch analytics data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VisitorChart data={data?.visitorTrends || { dates: [], visitors: [], pageViews: [] }} />
        <BlogAnalytics posts={data?.blogPerformance || []} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GeographicHeatmap data={data?.geoData || []} />
        <DeviceAnalytics data={data?.deviceStats || { desktop: 0, mobile: 0, tablet: 0 }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RealTimeVisitors />
        </div>
        <div>
          <EngagementMetrics />
        </div>
      </div>
    </div>
  );
};
