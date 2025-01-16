import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardContentProps {
  children: ReactNode;
  className?: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
}) => {
  return (
    <motion.main
      className="
        flex-1 
        p-6 
        bg-gray-50 
        dark:bg-gray-900 
        overflow-y-auto
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.main>
  );
};
