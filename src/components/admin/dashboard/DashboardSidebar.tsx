import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tab } from "@/types/dashboard";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const sidebarClasses = `
    relative
    ${
      isMobile
        ? `fixed inset-y-0 left-0 z-50 transform transition-all duration-200 ease-in-out
         ${isOpen ? "translate-x-0" : "-translate-x-full"}`
        : `w-${isCollapsed ? "20" : "64"} shrink-0 transition-all duration-200`
    }
    bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
    border-r border-border/40 overflow-y-auto
  `;

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <motion.div className={sidebarClasses}>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-2 z-50 rounded-full bg-background shadow-md border"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}

        <nav className="space-y-2 p-4">
          {tabs.map((tab) => (
            <motion.div
              key={tab.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeTab === tab.value ? "default" : "ghost"}
                className={`
                  w-full justify-start text-base font-medium
                  ${
                    activeTab === tab.value
                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent"
                  }
                `}
                onClick={() => handleTabClick(tab.value)}
                aria-selected={activeTab === tab.value}
              >
                <tab.icon
                  className={`h-5 w-5 ${activeTab === tab.value ? "text-primary" : tab.color}`}
                />
                {!isCollapsed && <span className="ml-2">{tab.label}</span>}
              </Button>
            </motion.div>
          ))}
        </nav>
      </motion.div>
    </>
  );
};
