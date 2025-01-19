import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  children: React.ReactNode;
}

export const DashboardContent = React.memo(({ children }: DashboardContentProps) => {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Content Grid Background */}
      <div className="absolute inset-0 z-0">
        <div
          className={cn(
            "absolute inset-0",
            "bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]",
            "bg-[length:20px_20px]"
          )}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10  space-y-6">
        {/* Content Sections */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {/* Stats Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className={cn(
              "col-span-1 md:col-span-2 lg:col-span-3",
              "p-6 rounded-2xl",
              "bg-white/40 dark:bg-gray-900/40",
              "backdrop-blur-xl",
              "border border-white/20 dark:border-gray-800/20",
              "shadow-lg shadow-black/5"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard Overview
              </h2>
              <div className="flex items-center gap-2">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Cards */}
              {["Views", "Projects", "Clients"].map((stat, index) => (
                <motion.div
                  key={stat}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-4 rounded-xl",
                    "bg-white/30 dark:bg-gray-800/30",
                    "border border-white/20 dark:border-gray-800/20",
                    "group hover:bg-white/40 dark:hover:bg-gray-800/40",
                    "transition-all duration-200"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-3 rounded-lg",
                        "bg-primary-teal/10",
                        "group-hover:bg-primary-teal/20",
                        "transition-colors duration-200"
                      )}
                    >
                      <svg
                        className="w-6 h-6 text-primary-teal"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total {stat}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.floor(Math.random() * 1000)}
                      </h3>
                      <p className="text-xs text-green-600 mt-1">
                        +{Math.floor(Math.random() * 100)}% from last month
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="col-span-1 md:col-span-2 lg:col-span-3"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
});
