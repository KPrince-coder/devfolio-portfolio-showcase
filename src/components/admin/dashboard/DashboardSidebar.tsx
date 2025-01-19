import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tab } from "@/types/dashboard";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isMobile,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const sidebarClasses = cn(
    "relative h-screen",
    isMobile
      ? "fixed inset-y-0 left-0 z-50 w-[280px]"
      : cn(
          isCollapsed ? "w-[80px]" : "w-[280px]",
          "transition-all duration-300 ease-in-out"
        ),
    "bg-white/40 dark:bg-gray-900/40",
    "backdrop-blur-xl",
    "border-r border-white/20 dark:border-gray-800/20",
    "flex flex-col"
  );

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    if (isMobile) {
      onClose();
    }
  };

  const sidebarContent = useMemo(
    () => (
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div
          className={cn(
            "relative p-6",
            "flex items-center",
            "border-b border-white/20 dark:border-gray-800/20"
          )}
        >
          <motion.div
            className="flex items-center gap-3"
            initial={false}
            animate={{ width: isCollapsed ? "auto" : "100%" }}
          >
            <div
              className={cn(
                "flex items-center justify-center",
                "w-10 h-10 rounded-xl",
                "bg-primary-teal",
                "text-white font-bold text-xl"
              )}
            >
              D
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
              >
                Devfolio
              </motion.span>
            )}
          </motion.div>

          {!isMobile && (
            <motion.button
              onClick={onToggleCollapse}
              className={cn(
                "absolute -right-3 top-1/2 -translate-y-1/2",
                "w-6 h-12 rounded-full",
                "bg-white dark:bg-gray-900",
                "border border-white/20 dark:border-gray-800/20",
                "flex items-center justify-center",
                "shadow-lg shadow-black/5",
                "hover:shadow-xl hover:scale-105",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary-teal",
                "group"
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "text-gray-400 dark:text-gray-600",
                  "group-hover:text-primary-teal",
                  "transition-colors duration-200"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {isCollapsed ? (
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "relative w-full group",
                            "flex items-center gap-3",
                            "p-3 rounded-xl",
                            "transition-all duration-200",
                            activeTab === tab.value
                              ? "bg-primary-teal text-white"
                              : "hover:bg-white/40 dark:hover:bg-gray-800/40"
                          )}
                          onClick={() => handleTabClick(tab.value)}
                          aria-current={
                            activeTab === tab.value ? "page" : undefined
                          }
                        >
                          <tab.icon
                            className={cn(
                              "h-5 w-5 transition-transform duration-200",
                              activeTab === tab.value
                                ? "text-white"
                                : "text-gray-600 dark:text-gray-400",
                              "group-hover:scale-110"
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="z-[9999] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg"
                      >
                        <p>{tab.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative w-full group",
                      "flex items-center gap-3",
                      "p-3 rounded-xl",
                      "transition-all duration-200",
                      activeTab === tab.value
                        ? "bg-primary-teal text-white"
                        : "hover:bg-white/40 dark:hover:bg-gray-800/40"
                    )}
                    onClick={() => handleTabClick(tab.value)}
                    aria-current={activeTab === tab.value ? "page" : undefined}
                  >
                    {/* Tab Background Effect */}
                    {activeTab === tab.value && (
                      <motion.div
                        layoutId="activeTab"
                        className={cn(
                          "absolute inset-0 rounded-xl",
                          "bg-gradient-to-r from-primary-teal to-primary-teal/80",
                          "opacity-100"
                        )}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}

                    {/* Tab Content */}
                    <span className="relative z-10 flex items-center gap-3">
                      <tab.icon
                        className={cn(
                          "h-5 w-5 transition-transform duration-200",
                          activeTab === tab.value
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-400",
                          "group-hover:scale-110"
                        )}
                      />

                      <span
                        className={cn(
                          "font-medium transition-colors duration-200",
                          activeTab === tab.value
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-400"
                        )}
                      >
                        {tab.label}
                      </span>
                    </span>
                  </Button>
                )}
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 mt-auto",
              "border-t border-white/20 dark:border-gray-800/20"
            )}
          >
            <div
              className={cn(
                "p-4 rounded-xl",
                "bg-gradient-to-br from-primary-teal/10 to-transparent",
                "border border-white/20 dark:border-gray-800/20"
              )}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need help? Check our
                <button className="ml-1 text-primary-teal hover:underline focus:outline-none">
                  documentation
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    ),
    [tabs, activeTab, isCollapsed, onTabChange, onToggleCollapse]
  );

  return (
    <AnimatePresence mode="wait">
      {(isOpen || !isMobile) && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />
          )}

          <motion.aside
            className={sidebarClasses}
            initial={isMobile ? "closed" : false}
            animate={isMobile ? "open" : true}
            exit={isMobile ? "closed" : undefined}
            variants={sidebarVariants}
            role="navigation"
            aria-label="Main navigation"
          >
            {sidebarContent}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
