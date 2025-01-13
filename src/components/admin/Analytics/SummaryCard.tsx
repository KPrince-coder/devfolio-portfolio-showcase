import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  color: string;
}

export const SummaryCard = ({ title, value, trend, icon, color }: SummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={cn("overflow-hidden", color)}>
        <div className="p-6 relative">
          {/* Icon and Trend */}
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white/20 rounded-lg">
              {icon}
            </div>
            <div 
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                trend >= 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
              )}
            >
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          </div>

          {/* Value and Title */}
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            <p className="text-sm text-white/60">
              {title}
            </p>
          </div>

          {/* Background Gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5"
            style={{ mixBlendMode: 'overlay' }}
          />
        </div>

        {/* Bottom Progress Bar */}
        <div className="h-1 w-full bg-black/10">
          <div 
            className="h-full bg-white/20 transition-all duration-1000"
            style={{ width: `${Math.min(Math.abs(trend) * 2, 100)}%` }}
          />
        </div>
      </Card>
    </motion.div>
  );
};
