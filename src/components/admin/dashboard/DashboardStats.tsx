import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  Users, 
  Star, 
  Eye, 
  MessageSquare, 
  ThumbsUp 
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className={cn(
      "relative p-6 rounded-2xl",
      "bg-white/40 dark:bg-gray-900/40",
      "backdrop-blur-xl",
      "border border-white/20 dark:border-gray-800/20",
      "group hover:shadow-lg",
      "transition-all duration-200"
    )}
  >
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "text-xs font-medium",
              change >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {change >= 0 ? "+" : ""}{change}%
          </motion.span>
        </div>
      </div>

      <div className={cn(
        "p-4 rounded-xl",
        "bg-opacity-10",
        "group-hover:scale-110",
        "transition-transform duration-200",
        color
      )}>
        {icon}
      </div>
    </div>

    {/* Progress Bar */}
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">Progress</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {Math.abs(change)}%
        </span>
      </div>
      <div className="relative h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.abs(change)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            change >= 0 ? "bg-green-500" : "bg-red-500"
          )}
        />
      </div>
    </div>

    {/* Sparkline Graph */}
    <div className="mt-4 h-16">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          d={generateSparkline(10)}
          fill="none"
          stroke={change >= 0 ? "#22C55E" : "#EF4444"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </motion.div>
);

const generateSparkline = (points: number): string => {
  const data: number[] = Array.from({ length: points }, () => Math.random() * 30 + 10);
  const width = 100 / (points - 1);
  return `M 0 ${40 - data[0]} ` + data.slice(1).map((d, i) => `L ${width * (i + 1)} ${40 - d}`).join(" ");
};

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: "Total Views",
      value: "2.7K",
      change: 12.5,
      icon: <Eye className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-500"
    },
    {
      title: "Total Users",
      value: "1.2K",
      change: 8.2,
      icon: <Users className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-500"
    },
    {
      title: "Engagement Rate",
      value: "85%",
      change: -2.4,
      icon: <ThumbsUp className="w-6 h-6 text-green-500" />,
      color: "bg-green-500"
    },
    {
      title: "Reviews",
      value: "4.9",
      change: 4.1,
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      color: "bg-yellow-500"
    },
    {
      title: "Growth Rate",
      value: "+24%",
      change: 16.8,
      icon: <TrendingUp className="w-6 h-6 text-red-500" />,
      color: "bg-red-500"
    },
    {
      title: "Comments",
      value: "892",
      change: -5.2,
      icon: <MessageSquare className="w-6 h-6 text-indigo-500" />,
      color: "bg-indigo-500"
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};