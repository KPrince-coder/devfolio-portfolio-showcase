import React, { useState } from "react";
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
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileSettingsForm } from "../forms/ProfileSettingsForm";

interface DashboardHeaderProps {
  user: SupabaseUser | null;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
  isMobile: boolean;
}

export function DashboardHeader({
  user,
  isDarkMode,
  onThemeToggle,
  onLogout,
  onMenuClick,
  isMobile,
}: DashboardHeaderProps) {
  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AD";

  const [showProfileSettings, setShowProfileSettings] = useState(false);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40",
        "flex items-center justify-between",
        "h-16 ",
        "bg-white/40 dark:bg-gray-900/40",
        "backdrop-blur-xl",
        "border-b border-white/20 dark:border-gray-800/20",
        "transition-all duration-200",
        isMobile ? "px-6" : "pl-0 pr-10"
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      role="banner"
      aria-label="Dashboard header"
    >
      {/* Left Section */}
      <motion.div
        className={`flex items-center ${isMobile ? "gap-4" : "gap-0"}`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center rounded-md hover:bg-accent p-2 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {!isMobile && <div className="w-10" />}
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
              {user?.email || "Admin"}
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative",
                    "hover:bg-white/40 dark:hover:bg-gray-800/40",
                    "transition-transform duration-200"
                  )}
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
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onThemeToggle} />
        </motion.div>

        {/* Desktop Logout */}
        <motion.div
          className="hidden sm:block"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
                aria-label="User menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.email || "User avatar"}
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="end"
              side="bottom"
              sideOffset={5}
              onCloseAutoFocus={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setShowProfileSettings(true)}
                onSelect={(e) => e.preventDefault()}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={onLogout}
                onSelect={(e) => e.preventDefault()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      {/* Profile Settings Dialog */}
      {user && (
        <ProfileSettingsForm
          open={showProfileSettings}
          onClose={() => setShowProfileSettings(false)}
          currentEmail={user.email || ""}
        />
      )}
    </motion.header>
  );
}
