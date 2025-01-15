import React, { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
  isMobile: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children, 
  isDarkMode, 
  isMobile
}) => {
  return (
    <div 
      className={`
        flex flex-col 
        min-h-screen 
        bg-gradient-to-br 
        from-gray-50 to-gray-100 
        dark:from-gray-900 dark:to-gray-800 
        ${isDarkMode ? 'dark' : ''}
        transition-colors duration-300
      `}
      data-theme={isDarkMode ? 'dark' : 'light'}
      aria-label="Dashboard Layout"
    >
      {children}
    </div>
  );
};