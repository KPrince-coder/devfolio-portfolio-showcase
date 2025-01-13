import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock, MousePointer, ArrowDownUp, Users, Eye, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface EngagementMetric {
  icon: React.ElementType;
  label: string;
  value: string;
  secondaryValue?: string;
  trend: number;
  color: string;
  description?: string;
}

interface EngagementMetricsProps {
  metrics?: EngagementMetric[];
  className?: string;
}

export const EngagementMetrics = ({ 
  metrics = defaultMetrics,
  className 
}: EngagementMetricsProps) => {
  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold mb-6">Engagement Metrics</h3>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  `${metric.color}/10 text-${metric.color} group-hover:bg-${metric.color}/20`
                )}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {metric.secondaryValue && (
                      <span className="text-sm text-muted-foreground">
                        {metric.secondaryValue}
                      </span>
                    )}
                  </div>
                  {metric.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {metric.description}
                    </p>
                  )}
                </div>
              </div>
              <div className={cn(
                "text-sm font-medium",
                metric.trend > 0 ? "text-green-500" : "text-red-500"
              )}>
                {metric.trend > 0 ? "+" : ""}{metric.trend}%
              </div>
            </div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className={cn("h-full", `bg-${metric.color}`)}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(metric.trend) * 2, 100)}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

const defaultMetrics: EngagementMetric[] = [
  {
    icon: Clock,
    label: "Avg. Session Duration",
    value: "2m 35s",
    trend: 12.5,
    color: "blue-500",
    description: "Time spent per visit"
  },
  {
    icon: MousePointer,
    label: "Click-through Rate",
    value: "24.8%",
    trend: -2.4,
    color: "pink-500",
    description: "Percentage of clicks per view"
  },
  {
    icon: ArrowDownUp,
    label: "Bounce Rate",
    value: "42.3%",
    trend: -5.7,
    color: "green-500",
    description: "Single-page visit percentage"
  },
  {
    icon: Users,
    label: "Return Visitors",
    value: "12.4k",
    secondaryValue: "64% of total",
    trend: 8.3,
    color: "purple-500"
  },
  {
    icon: Brain,
    label: "Engagement Score",
    value: "8.9",
    secondaryValue: "out of 10",
    trend: 15.2,
    color: "amber-500",
    description: "Overall user interaction score"
  }
];
