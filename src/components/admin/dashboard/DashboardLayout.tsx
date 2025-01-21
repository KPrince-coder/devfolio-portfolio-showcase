import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
// import { useMediaQuery } from "@/hooks/use-media-query";
import { DashboardLoader } from "../loaders/DashboardLoader";
import { Tab } from "@/types/dashboard";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  FileEdit,
  Settings,
  FileText,
  Code2,
  GraduationCap,
  BrainCircuit,
  Briefcase,
  Trophy,
  Contact,
  Gauge,
  LineChart,
  User,
  Menu,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

// Import managers
import { DashboardManager } from "@/components/admin/managers/DashboardManager";
import { ProjectManager } from "@/components/admin/managers/ProjectManager";
import { BlogManager } from "@/components/admin/managers/BlogManager";
import { MessageManager } from "@/components/admin/managers/MessageManager";
import { TimelineManager } from "@/components/admin/managers/TimelineManager";
import { ProfileManager } from "@/components/admin/managers/ProfileManager";
import { TechnicalSkillsManager } from "@/components/admin/managers/TechnicalSkillsManager";
import { TechnicalProficiencyManager } from "@/components/admin/managers/TechnicalProficiencyManager";
import { AnalyticsDashboardManager } from "@/components/admin/managers/AnalyticsDashboardManager";

const defaultTabs: Tab[] = [
  {
    label: "Dashboard",
    value: "dashboard",
    icon: LayoutDashboard,
    color: "#4F46E5",
  },
  {
    label: "Analytics",
    value: "analytics",
    icon: LineChart,
    color: "#8B5CF6",
  },
  {
    label: "Profile",
    value: "profile",
    icon: FileText,
    color: "#EC4899",
  },
  {
    label: "Projects",
    value: "projects",
    icon: Briefcase,
    color: "#10B981",
  },
  {
    label: "Blog Posts",
    value: "blogs",
    icon: FileEdit,
    color: "#F59E0B",
  },
  {
    label: "Timeline",
    value: "timeline",
    icon: Contact,
    color: "#6366F1",
  },
  {
    label: "Technical Skills",
    value: "technical-skills",
    icon: Code2,
    color: "#14B8A6",
  },
  {
    label: "Proficiency",
    value: "proficiency",
    icon: Gauge,
    color: "#8B5CF6",
  },
  {
    label: "Messages",
    value: "messages",
    icon: Settings,
    color: "#EC4899",
  },
  {
    label: "Users",
    value: "users",
    icon: User,
    color: "#14B8A6",
  },
  {
    label: "Settings",
    value: "settings",
    icon: Settings,
    color: "#6B7280",
  },
];

const profileSubTabs: Tab[] = [
  {
    value: "profile-main",
    icon: User,
    label: "Profile",
    color: "#EC4899",
  },
  {
    label: "Education",
    value: "education",
    icon: GraduationCap,
    color: "#8B5CF6",
  },
  {
    label: "Hobbies",
    value: "hobbies",
    icon: BrainCircuit,
    color: "#F59E0B",
  },
  {
    label: "Social Links",
    value: "social-links",
    icon: Contact,
    color: "#6366F1",
  },
];

export const DashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(defaultTabs[0].value);
  const [activeSubTab, setActiveSubTab] = useState<string>(
    profileSubTabs[0].value
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Check system dark mode preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }

    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width < 780);
      setIsCollapsed(width < 1280);
      if (width >= 780) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Auth context for logging out
  const { user, handleLogout } = useAuth();

  const handleLogoutClick = async () => {
    // Show loading toast
    toast({
      title: "Logging out...",
      description: "See you next time! 👋",
      duration: 1500,
    });

    // Slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Call the actual logout function
    await handleLogout();
  };

  // Handle click outside sidebar for mobile
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (isSmallScreen && isSidebarOpen) {
        const sidebar = document.getElementById("dashboard-sidebar");
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    },
    [isSmallScreen, isSidebarOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Update sidebar state based on screen size
  useEffect(() => {
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isSmallScreen]);

  const renderManager = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardManager />;
      case "analytics":
        return <AnalyticsDashboardManager />;
      case "projects":
        return <ProjectManager />;
      case "blogs":
        return <BlogManager />;
      case "timeline":
        return <TimelineManager />;
      case "profile":
        return (
          <ProfileManager
            activeSubTab={activeSubTab}
            subTabs={profileSubTabs}
            onSubTabChange={setActiveSubTab}
          />
        );
      case "technical-skills":
        return <TechnicalSkillsManager />;
      case "proficiency":
        return <TechnicalProficiencyManager />;
      case "messages":
        return <MessageManager />;
      default:
        return <DashboardManager />;
    }
  };

  return (
    <div
      className={cn(
        "relative min-h-screen w-full",
        "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50",
        "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
        "overflow-hidden",
        "transition-colors duration-500"
      )}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <DashboardLoader />
        ) : (
          <>
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
              <div
                className={cn(
                  "absolute top-0 -left-4 w-72 h-72",
                  "bg-primary-teal/30 dark:bg-primary-teal/20",
                  "rounded-full blur-3xl",
                  "animate-pulse",
                  "opacity-20 dark:opacity-30"
                )}
              />
              <div
                className={cn(
                  "absolute bottom-0 right-0 w-96 h-96",
                  "bg-primary-teal/20",
                  "rounded-full blur-3xl",
                  "animate-pulse",
                  "opacity-20 dark:opacity-30",
                  "animation-delay-2000"
                )}
              />
            </div>

            {/* Main Layout */}
            <div className="relative z-10 flex min-h-screen">
              {/* Sidebar */}
              <aside
                id="dashboard-sidebar"
                className={cn(
                  "fixed inset-y-0 left-0 z-50",
                  "flex-shrink-0",
                  "bg-background/80 backdrop-blur-xl",
                  "transition-all duration-300 ease-in-out",
                  isSmallScreen ? "fixed w-64" : "relative",
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                  !isSmallScreen && (isCollapsed ? "w-20" : "w-60")
                )}
              >
                <DashboardSidebar
                  tabs={defaultTabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  isMobile={isSmallScreen}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  isCollapsed={!isSmallScreen && isCollapsed}
                  onToggleCollapse={() =>
                    !isSmallScreen && setIsCollapsed(!isCollapsed)
                  }
                />
              </aside>

              {/* Main Content Area */}
              <main
                className={cn(
                  "flex-1 flex flex-col",
                  "transition-all duration-300 ease-in-out",
                  !isSmallScreen && (isCollapsed ? "ml-0" : "ml-0"),
                  isSmallScreen && "ml-0",
                  "w-full"
                )}
              >
                <DashboardHeader
                  user={user}
                  isDarkMode={isDarkMode}
                  onThemeToggle={toggleTheme}
                  onLogout={handleLogoutClick}
                  onMenuClick={() => setIsSidebarOpen(true)}
                  isMobile={isSmallScreen}
                />

                <div className="flex-1 overflow-y-auto p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {renderManager()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
