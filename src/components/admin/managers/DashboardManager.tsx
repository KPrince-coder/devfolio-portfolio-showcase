import React from "react";
import { DashboardStats } from "../dashboard/DashboardStats";
import { AnalyticsSummary } from "../dashboard/AnalyticsSummary";
import { DashboardOverview } from "../dashboard/DashboardOverview";
import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";

export const DashboardManager = React.memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 p-6"
    >
      {/* Overview Section */}
      <DashboardOverview />

      {/* Analytics Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Analytics & Performance</h2>
        <AnalyticsSummary />
        <DashboardStats />
      </div>

      {/* Activity & Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div
          className="
            bg-blue-50 dark:bg-blue-900/50
            rounded-2xl p-6
            border border-blue-100 dark:border-blue-800
          "
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="text-blue-600 dark:text-blue-300" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
              Recent Activity
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-200">
            No recent activities
          </p>
        </motion.div>

        <motion.div
          className="
            bg-green-50 dark:bg-green-900/50
            rounded-2xl p-6
            border border-green-100 dark:border-green-800
          "
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-green-600 dark:text-green-300" />
            <span className="text-sm font-medium text-green-700 dark:text-green-200">
              Performance
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-200">
            All systems running smoothly
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
});
