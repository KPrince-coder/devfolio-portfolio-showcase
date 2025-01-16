import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, BarChart2, MessageCircle, 
  Laptop, Newspaper, User, Clock, 
  Palette, GraduationCap, BookOpen 
} from "lucide-react";

// Custom Hooks
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useResponsive } from "@/hooks/use-responsive";

// Components
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import { DashboardContent } from "./dashboard/DashboardContent";

import { AnalyticsDashboard } from "./Analytics/AnalyticsDashboard";

// Managers
import { MessagesManager } from "./managers/MessagesManager";
import { ProjectManager } from "./managers/ProjectManager";
import { BlogManager } from "./managers/BlogManager";
import { ProfileManager } from "./managers/ProfileManager";
import { TimelineManager } from "./managers/TimelineManager";

// Types
import { Tab } from "@/types/dashboard";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeSubTab, setActiveSubTab] = useState<string | null>("profile-main");

  // Custom Hooks
  const { isDarkMode, toggleTheme } = useTheme();
  const { isMobile } = useResponsive();
  const { user, handleLogout } = useAuth();

  // Memoized Tab Configurations
  const mainTabs = useMemo<Tab[]>(() => [
    { 
      value: "dashboard", 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      color: "text-indigo-600" 
    },
    { 
      value: "analytics", 
      icon: BarChart2, 
      label: "Analytics", 
      color: "text-purple-600" 
    },
    { 
      value: "messages", 
      icon: MessageCircle, 
      label: "Messages", 
      color: "text-blue-600" 
    },
    { 
      value: "projects", 
      icon: Laptop, 
      label: "Projects", 
      color: "text-green-600" 
    },
    { 
      value: "blog", 
      icon: Newspaper, 
      label: "Blog", 
      color: "text-pink-600" 
    },
    { 
      value: "profile", 
      icon: User, 
      label: "Profile", 
      color: "text-purple-600" 
    },
    { 
      value: "timeline", 
      icon: Clock, 
      label: "Timeline", 
      color: "text-orange-600" 
    }
  ], []);

  const profileSubTabs = useMemo<Tab[]>(() => [
    { 
      value: "profile-main", 
      icon: User, 
      label: "Profile", 
      color: "text-purple-600" 
    },
    { 
      value: "hobbies", 
      icon: Palette, 
      label: "Hobbies", 
      color: "text-teal-600" 
    },
    { 
      value: "education", 
      icon: GraduationCap, 
      label: "Education", 
      color: "text-blue-600" 
    },
    { 
      value: "social-links", 
      icon: BookOpen, 
      label: "Social Links", 
      color: "text-green-600" 
    }
  ], []);

  // Tab Change Handler
  const handleTabChange = useCallback((tab: string) => {
    console.log("Changing tab to:", tab);
    setActiveTab(tab);
    if (tab === "profile") {
      setActiveSubTab("profile-main");
    } else {
      setActiveSubTab(null);
    }
  }, []);

  // Content Rendering Logic
  const renderContent = useCallback(() => {
    console.log("Rendering content for tab:", activeTab);
    console.log("Active subtab:", activeSubTab);

    const contentMap: { [key: string]: React.ReactNode } = {
      analytics: <AnalyticsDashboard />,
      messages: <MessagesManager />,
      projects: <ProjectManager />,
      blog: <BlogManager />,
      timeline: <TimelineManager />,
      profile: (
        <ProfileManager 
          activeSubTab={activeSubTab} 
          subTabs={profileSubTabs}
        />
      )
    };

    return contentMap[activeTab] || null;
  }, [activeTab, activeSubTab, profileSubTabs]);

  return (
    <DashboardLayout 
      isDarkMode={isDarkMode}
      isMobile={isMobile}
    >
      <DashboardHeader 
        user={user}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar 
          tabs={mainTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <DashboardContent>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </DashboardContent>
      </div>
    </DashboardLayout>
  );
};

export default React.memo(AdminDashboard);
