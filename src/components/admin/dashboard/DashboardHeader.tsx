import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { User, Bell, LogOut, Sun, Moon, Menu } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  user: any;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
  isMobile: boolean;
}

export const DashboardHeader = React.memo(({
  user,
  isDarkMode,
  onThemeToggle,
  onLogout,
  onMenuClick,
  isMobile,
}: DashboardHeaderProps) => {
  const handleNotificationClick = useCallback(() => {
    // Handle notification click
  }, []);

  const handleProfileClick = useCallback(() => {
    // Handle profile click
  }, []);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40",
        "flex items-center justify-between",
        "h-16 px-6",
        "bg-white/40 dark:bg-gray-900/40",
        "backdrop-blur-xl",
        "border-b border-white/20 dark:border-gray-800/20",
        "transition-all duration-200"
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      role="banner"
      aria-label="Dashboard header"
    >
      {/* Left Section */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className={cn(
            "hover:bg-white/40 dark:hover:bg-gray-800/40",
            "transition-transform duration-200 hover:scale-105"
          )}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Button>

        <motion.div
          className="hidden sm:flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <div
            className={cn(
              "p-2 rounded-xl",
              "bg-gradient-to-br from-primary-teal/20 to-primary-teal/5",
              "border border-white/20 dark:border-gray-800/20"
            )}
          >
            <User className="h-5 w-5 text-primary-teal" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-sm font-medium text-gray-900 dark:text-white">
              Welcome back,
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {user?.name || "Admin"}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Mobile Theme Toggle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isDarkMode ? "dark" : "light"}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            className="sm:hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              className={cn(
                "hover:bg-white/40 dark:hover:bg-gray-800/40",
                "transition-transform duration-200 hover:scale-105"
              )}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </motion.div>
        </AnimatePresence>

        {/* Notifications */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative",
                    "hover:bg-white/40 dark:hover:bg-gray-800/40",
                    "transition-transform duration-200"
                  )}
                  onClick={handleNotificationClick}
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "absolute -top-1 -right-1",
                      "h-4 w-4",
                      "flex items-center justify-center",
                      "text-[10px] font-medium",
                      "bg-primary-teal text-white",
                      "rounded-full"
                    )}
                  >
                    3
                  </motion.span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>3 unread notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Desktop Theme Toggle */}
        <motion.div
          className="hidden sm:flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <div
            className={cn(
              "p-2 rounded-xl",
              "flex items-center gap-2",
              "bg-white/40 dark:bg-gray-800/40",
              "border border-white/20 dark:border-gray-800/20"
            )}
          >
            <Sun className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={onThemeToggle}
              aria-label="Toggle theme"
              className="data-[state=checked]:bg-primary-teal"
            />
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        </motion.div>

        {/* Desktop Logout */}
        <motion.div
          className="hidden sm:block"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="default"
            onClick={onLogout}
            className={cn(
              "bg-gradient-to-r from-primary-teal to-primary-teal/90",
              "text-white",
              "border border-white/20 dark:border-gray-800/20",
              "shadow-lg shadow-primary-teal/20",
              "hover:shadow-xl hover:shadow-primary-teal/30",
              "transition-all duration-200"
            )}
            aria-label="Sign out"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </motion.div>

        {/* Mobile Logout */}
        <motion.div className="sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className={cn(
              "hover:bg-white/40 dark:hover:bg-gray-800/40",
              "transition-transform duration-200 hover:scale-105"
            )}
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.header>
  );
});
