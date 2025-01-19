import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MousePointer, ArrowDownUp, Users, Eye, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EngagementMetric {
  icon: React.ElementType;
  label: string;
  value: string;
  secondaryValue?: string;
  trend: number;
  color: string;
  description?: string;
  previousValue?: string;
}

interface EngagementMetricsProps {
  metrics?: EngagementMetric[];
  className?: string;
  isLoading?: boolean;
}

export const EngagementMetrics = ({
  metrics = defaultMetrics,
  className,
  isLoading = false,
}: EngagementMetricsProps) => {
  if (isLoading) {
    return (
      <Card className={cn("p-6", className)}>
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-1 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6", className)}>
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold mb-6"
      >
        Engagement Metrics
      </motion.h3>
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      `${metric.color}/10 text-${metric.color} group-hover:bg-${metric.color}/20`
                    )}
                  >
                    <metric.icon className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm text-muted-foreground cursor-help">
                            {metric.label}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{metric.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-2">
                      <motion.p
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="text-2xl font-bold"
                      >
                        {metric.value}
                      </motion.p>
                      {metric.secondaryValue && (
                        <span className="text-sm text-muted-foreground">
                          {metric.secondaryValue}
                        </span>
                      )}
                    </div>
                    {metric.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="text-sm text-muted-foreground mt-1"
                      >
                        {metric.description}
                      </motion.p>
                    )}
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.1 }}
                        className={cn(
                          "text-sm font-medium px-2 py-1 rounded-full",
                          metric.trend > 0
                            ? "text-green-500 bg-green-500/10"
                            : "text-red-500 bg-red-500/10"
                        )}
                      >
                        {metric.trend > 0 ? "+" : ""}
                        {metric.trend}%
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Previous: {metric.previousValue || "N/A"}
                        <br />
                        Change: {metric.trend > 0 ? "+" : ""}
                        {metric.trend}%
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full", `bg-${metric.color}`)}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.abs(metric.trend) * 2, 100)}%` }}
                  transition={{
                    duration: 1,
                    delay: index * 0.1 + 0.2,
                    ease: "easeOut",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
};

const defaultMetrics: EngagementMetric[] = [
  {
    icon: Clock,
    label: "Avg. Session Duration",
    value: "2m 35s",
    previousValue: "2m 15s",
    trend: 12.5,
    color: "blue-500",
    description: "Average time users spend on your portfolio",
  },
  {
    icon: MousePointer,
    label: "Click-through Rate",
    value: "24.8%",
    previousValue: "25.4%",
    trend: -2.4,
    color: "pink-500",
    description: "Percentage of visitors who click on links",
  },
  {
    icon: ArrowDownUp,
    label: "Bounce Rate",
    value: "32.1%",
    previousValue: "35.8%",
    trend: -10.3,
    color: "purple-500",
    description: "Percentage of visitors who leave after viewing one page",
  },
  {
    icon: Users,
    label: "Return Visitors",
    value: "45.2%",
    previousValue: "41.5%",
    trend: 8.9,
    color: "orange-500",
    description: "Percentage of visitors who return to your portfolio",
  },
  {
    icon: Eye,
    label: "Avg. Page Views",
    value: "3.8",
    secondaryValue: "per session",
    previousValue: "3.2",
    trend: 18.7,
    color: "green-500",
    description: "Average number of pages viewed per session",
  },
  {
    icon: Brain,
    label: "Content Engagement",
    value: "72.4%",
    previousValue: "68.9%",
    trend: 5.1,
    color: "yellow-500",
    description: "Percentage of visitors who interact with your content",
  },
];
