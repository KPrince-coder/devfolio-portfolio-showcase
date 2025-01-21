import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tab } from "@/types/dashboard";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function DashboardSidebar({
  tabs,
  activeTab,
  onTabChange,
  isMobile,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const handleTabClick = (tab: Tab) => {
    onTabChange(tab.value);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div className="relative flex h-full flex-col gap-4 p-4">
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-2",
          isCollapsed && !isMobile && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-lg bg-primary-teal text-white flex items-center justify-center font-bold text-lg">
            D
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-lg font-semibold">DevFolio</span>
          )}
        </div>

        {/* Only show collapse button on desktop */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <nav className="space-y-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.div
                key={tab.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TooltipProvider delayDuration={0}>
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
                        onClick={() => handleTabClick(tab)}
                      >
                        {/* Tab Background Effect */}
                        {activeTab === tab.value && (
                          <motion.div
                            layoutId="activeTab"
                            className={cn(
                              "absolute inset-0 rounded-xl",
                              "bg-primary-teal -z-10"
                            )}
                          />
                        )}

                        {/* Icon */}
                        <Icon className="h-5 w-5 shrink-0" />

                        {/* Label */}
                        {(!isCollapsed || isMobile) && (
                          <span className="text-sm">{tab.label}</span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    {isCollapsed && !isMobile && (
                      <TooltipContent side="right" className="font-medium">
                        {tab.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
