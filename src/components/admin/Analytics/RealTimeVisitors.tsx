import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Globe, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Visitor {
  id: string;
  page: string;
  country: string;
  city?: string;
  timestamp: string;
  device?: string;
}

export const RealTimeVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeVisitors, setActiveVisitors] = useState(0);

  useEffect(() => {
    // Fetch initial visitors
    const fetchVisitors = async () => {
      const { data } = await supabase
        .from('page_views')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (data) {
        const mappedData = data.map(item => ({
          id: item.id,
          page: item.path,
          country: item.country,
          city: undefined,
          timestamp: item.timestamp,
          device: item.device_type
        }));
        setVisitors(mappedData);
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
    return date.toLocaleTimeString();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          <h3 className="text-lg font-semibold">Real-time Activity</h3>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          {activeVisitors} active now
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visitors.map((visitor) => (
            <motion.div
              key={visitor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors mb-2"
            >
              <Globe className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{visitor.page}</p>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{visitor.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimestamp(visitor.timestamp)}</span>
                  {visitor.device && (
                    <span className="px-1.5 py-0.5 rounded-full bg-muted text-xs">
                      {visitor.device}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
};
