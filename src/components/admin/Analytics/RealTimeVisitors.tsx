import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Globe,
  Clock,
  ArrowRight,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Visitor {
  id: string;
  page: string;
  country: string;
  city?: string;
  timestamp: string;
  device?: string;
}

interface RealTimeVisitorsProps {
  className?: string;
  isLoading?: boolean;
}

const getDeviceIcon = (device: string = 'desktop') => {
  const icons = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
    other: Laptop,
  };
  return icons[device.toLowerCase() as keyof typeof icons] || Monitor;
};

export const RealTimeVisitors = ({
  className,
  isLoading = false,
}: RealTimeVisitorsProps) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial visitors
    const fetchVisitors = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('page_views')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);
        
        if (fetchError) throw fetchError;
        
        if (data) {
          const mappedData = data.map(item => ({
            id: item.id,
            page: item.path,
            country: item.country,
            city: item.city,
            timestamp: item.timestamp,
            device: item.device_type
          }));
          setVisitors(mappedData);
          setActiveVisitors(data.length);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch visitors');
      }
    };

    fetchVisitors();

    // Set up real-time subscription
    const subscription = supabase
      .channel('page_views')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'page_views' 
      }, payload => {
        setVisitors(prev => [payload.new as Visitor, ...prev.slice(0, 9)]);
        setActiveVisitors(current => current + 1);
      })
      .subscribe();

    // Update active visitors count periodically
    const interval = setInterval(() => {
      setActiveVisitors(prev => Math.max(0, prev - Math.floor(Math.random() * 2)));
    }, 5000);

    return () => {
      supabase.removeChannel(subscription);
      clearInterval(interval);
    };
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    return date.toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
          <ScrollArea className="h-[400px]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </ScrollArea>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center text-red-500">
          <p>Error loading real-time visitors:</p>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold"
          >
            Real-time Activity
          </motion.h3>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          {activeVisitors} active now
        </motion.div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visitors.map((visitor) => {
            const DeviceIcon = getDeviceIcon(visitor.device);
            return (
              <motion.div
                key={visitor.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors mb-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-primary/10 rounded-lg text-primary"
                  >
                    <Globe className="h-5 w-5" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="font-medium truncate">
                            {visitor.page}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Full path: {visitor.page}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{visitor.country}</span>
                      {visitor.city && (
                        <>
                          <ArrowRight className="h-3 w-3" />
                          <span>{visitor.city}</span>
                        </>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <DeviceIcon className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Device: {visitor.device || 'Unknown'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                    <Clock className="h-4 w-4" />
                    {formatTimestamp(visitor.timestamp)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
};
