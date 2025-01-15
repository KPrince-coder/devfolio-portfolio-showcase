import React from 'react';
import { User, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardHeaderProps {
  user: any;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user, 
  isDarkMode, 
  toggleTheme, 
  onLogout
}) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-800/80 shadow-sm">
      <div className="flex items-center space-x-4">
        <User className="w-8 h-8 text-gray-600 dark:text-gray-300" />
        <h1 className="text-xl font-bold">
          Welcome, {user?.name || 'User'}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                3
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <div className="flex items-center space-x-2">
          <Sun className="w-5 h-5 text-yellow-500" />
          <Switch 
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
          <Moon className="w-5 h-5 text-blue-500" />
        </div>

        <Button 
          variant="destructive" 
          onClick={onLogout}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
};