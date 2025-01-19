import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
  isLoading?: boolean;
  previousValue?: string | number;
}

export const SummaryCard = ({
  title,
  value,
  trend,
  icon,
  color,
  description,
  isLoading = false,
  previousValue,
}: SummaryCardProps) => {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 relative">
          <div className="flex justify-between items-start">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </Card>
    );
  }

  const trendColor = trend >= 0 ? "text-green-500" : "text-red-500";
  const trendBg = trend >= 0 ? "bg-green-500/20" : "bg-red-500/20";
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;
  const formattedPrevValue =
    typeof previousValue === "number"
      ? previousValue.toLocaleString()
      : previousValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className={cn("overflow-hidden h-full", color)}>
        <div className="p-6 relative h-full">
          {/* Icon and Trend */}
          <div className="flex justify-between items-start">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 rounded-lg"
            >
              {icon}
            </motion.div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                      trendBg,
                      trendColor
                    )}
                  >
                    {trend >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(trend)}%</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Previous: {formattedPrevValue || "N/A"}
                    <br />
                    Change: {trend >= 0 ? "+" : ""}
                    {trend}%
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Value and Title */}
          <div className="mt-4 space-y-1">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white"
            >
              {formattedValue}
            </motion.h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-white/60">{title}</p>
              {description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-white/60" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Background Gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"
            style={{ mixBlendMode: "overlay" }}
          />
        </div>

        {/* Bottom Progress Bar */}
        <motion.div
          className="h-1 w-full bg-black/10"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="h-full bg-white/20"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(Math.abs(trend) * 2, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
      </Card>
    </motion.div>
  );
};
