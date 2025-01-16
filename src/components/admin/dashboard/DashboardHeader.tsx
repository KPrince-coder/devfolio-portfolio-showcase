import React from "react";
import { User, Bell, LogOut, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  user: any;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
  isMobile: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  isDarkMode,
  toggleTheme,
  onLogout,
  onMenuClick,
  isMobile,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="hidden md:flex items-center space-x-3">
          <User className="h-6 w-6 text-foreground/80" />
          <h1 className="text-lg font-semibold">
            Welcome, {user?.name || "User"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile user name */}
        <span className="md:hidden text-sm font-medium">
          {user?.name || "User"}
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
                3
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <div className="hidden md:flex items-center gap-2">
          <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
            aria-label="Toggle theme"
          />
          <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </div>

        <Button
          variant="destructive"
          onClick={onLogout}
          className="hidden md:inline-flex"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>

        {/* Mobile theme toggle and logout */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
