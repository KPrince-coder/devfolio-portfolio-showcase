import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Code,
  Briefcase,
  Heart,
  Newspaper,
  GraduationCap,
  Link as LinkIcon,
  Gauge,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatCard = React.memo(({ title, value, icon: Icon, color }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "p-6 rounded-xl",
      "bg-white dark:bg-gray-800",
      "border border-white/20 dark:border-gray-800/20",
      "shadow-lg shadow-black/5",
      "group"
    )}
  >
    <div className="flex items-center gap-4">
      <div
        className={cn(
          "p-3 rounded-lg",
          "transition-colors duration-200"
        )}
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
    </div>
  </motion.div>
));

export const DashboardOverview = React.memo(() => {
  // TODO: Replace with actual data from your database
  const stats = [
    {
      title: "Messages",
      value: 12,
      icon: MessageSquare,
      color: "#EC4899",
    },
    {
      title: "Technical Skills",
      value: 15,
      icon: Code,
      color: "#14B8A6",
    },
    {
      title: "Projects",
      value: 8,
      icon: Briefcase,
      color: "#10B981",
    },
    {
      title: "Hobbies",
      value: 6,
      icon: Heart,
      color: "#EF4444",
    },
    {
      title: "Blog Posts",
      value: 10,
      icon: Newspaper,
      color: "#F59E0B",
    },
    {
      title: "Education",
      value: 3,
      icon: GraduationCap,
      color: "#6366F1",
    },
    {
      title: "Social Links",
      value: 5,
      icon: LinkIcon,
      color: "#8B5CF6",
    },
    {
      title: "Proficiencies",
      value: 20,
      icon: Gauge,
      color: "#EC4899",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h2>
        <select
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm",
            "bg-white/50 dark:bg-gray-800/50",
            "border border-white/20 dark:border-gray-800/20",
            "focus:outline-none focus:ring-2 focus:ring-primary-teal"
          )}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
});
