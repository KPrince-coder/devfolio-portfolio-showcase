import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tab } from '@/types/dashboard';

interface DashboardSidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  tabs, 
  activeTab, 
  onTabChange
}) => {
  return (
    <motion.div 
      className="
        w-64 
        bg-white 
        dark:bg-gray-800 
        border-r 
        dark:border-gray-700 
        p-4 
        overflow-y-auto
      "
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="space-y-2">
        {tabs.map((tab) => (
          <motion.div
            key={tab.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={activeTab === tab.value ? "default" : "ghost"}
              className={`
                w-full 
                justify-start 
                text-base 
                font-medium
                ${activeTab === tab.value 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                  : `text-gray-700 dark:text-gray-200 ${tab.color}`
                }
              `}
              onClick={() => onTabChange(tab.value)}
              aria-selected={activeTab === tab.value}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </Button>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
};