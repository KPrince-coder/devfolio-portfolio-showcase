import { Users, Eye, ThumbsUp, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const AnalyticsCard = ({ title, value, trend, icon: Icon, color, index }: AnalyticsCardProps) => {
  const isPositive = trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "p-6",
        "bg-gradient-to-br",
        color,
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "border border-white/10",
        "backdrop-blur-sm"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
      whileHover={{ scale: 1.02 }}
      role="article"
      aria-label={`${title} analytics card`}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="p-2 bg-white/10 rounded-lg"
          >
            {Icon}
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full",
              "text-sm font-medium",
              isPositive ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
            )}
          >
            <TrendIcon className="h-3 w-3" />
            <span>{Math.abs(trend)}%</span>
          </motion.div>
        </div>

        <motion.div
          className="mt-4 space-y-1"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {value}
          </h3>
          <p className="text-sm text-white/70">{title}</p>
        </motion.div>

        {/* Bottom Progress Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/20"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: index * 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export const AnalyticsSummary = () => {
  const stats = [
    {
      label: "Total Visitors",
      value: "12.5K",
      trend: 12,
      icon: <Users className="h-6 w-6 text-white" />,
      color: "from-primary-teal to-primary-teal/80",
    },
    {
      label: "Page Views",
      value: "48.2K",
      trend: 18,
      icon: <Eye className="h-6 w-6 text-white" />,
      color: "from-violet-600 to-violet-700",
    },
    {
      label: "Engagement Rate",
      value: "6.8%",
      trend: 2.3,
      icon: <ThumbsUp className="h-6 w-6 text-white" />,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Avg. Session",
      value: "3m 45s",
      trend: -0.8,
      icon: <Clock className="h-6 w-6 text-white" />,
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      role="region"
      aria-label="Analytics summary"
    >
      {stats.map((stat, index) => (
        <AnalyticsCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
          index={index}
        />
      ))}
    </div>
  );
};