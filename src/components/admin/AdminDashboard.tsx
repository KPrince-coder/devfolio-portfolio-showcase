import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Laptop, 
  Newspaper, 
  User, 
  Clock, 
  LogOut, 
  Sun, 
  Moon, 
  LayoutDashboard,
  Bell,
  Zap,
  TrendingUp,
  BarChart2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageList } from "./MessageList";
import { ProjectManager } from "./ProjectManager";
import { BlogManager } from "./BlogManager";
import { ProfileManager } from "./ProfileManager";
import { TimelineManager } from "./TimelineManager";
import { AnalyticsDashboard } from './Analytics/AnalyticsDashboard';
import { DashboardStats } from "./dashboard/DashboardStats";
import { AnalyticsSummary } from "./dashboard/AnalyticsSummary";
import { HobbiesManager } from "./HobbiesManager";
import { EducationManager } from "./EducationManager";
import { SocialLinksManager } from "./SocialLinksManager";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
      return;
    }
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
    navigate("/login");
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const tabs = [
    { value: "dashboard", icon: LayoutDashboard, label: "Dashboard", color: "text-indigo-600" },
    { value: "analytics", icon: BarChart2, label: "Analytics", color: "text-purple-600" },
    { value: "messages", icon: MessageCircle, label: "Messages", color: "text-blue-600" },
    { value: "projects", icon: Laptop, label: "Projects", color: "text-green-600" },
    { value: "blog", icon: Newspaper, label: "Blog", color: "text-pink-600" },
    { value: "profile", icon: User, label: "Profile", color: "text-purple-600" },
    { value: "timeline", icon: Clock, label: "Timeline", color: "text-orange-600" }
  ];

  return (
    <TooltipProvider>
      <div className={`
        min-h-screen 
        bg-gradient-to-br 
        from-gray-50 to-gray-100 
        dark:from-gray-900 dark:to-gray-800 
        text-gray-900 dark:text-gray-100
        ${isDarkMode ? 'dark' : ''}
        transition-colors duration-300
      `}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <motion.h1 
            className="
              text-3xl md:text-4xl font-extrabold 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-indigo-600 to-pink-600
              text-center md:text-left
            "
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Admin Dashboard
          </motion.h1>
          
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
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  <Switch 
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                  <Moon className="w-5 h-5 text-blue-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle {isDarkMode ? 'Light' : 'Dark'} Mode</p>
              </TooltipContent>
            </Tooltip>
            
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <motion.div 
            className="
              md:col-span-2 
              bg-white dark:bg-gray-800 
              rounded-2xl shadow-xl p-4
              order-2 md:order-1
            "
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-2">
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
                      ${activeTab === tab.value 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:text-white' 
                        : `text-gray-700 dark:text-gray-200
                           hover:bg-gray-100 dark:hover:bg-gray-700
                           hover:text-gray-900 dark:hover:text-white
                           ${tab.color}`
                      }
                    `}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    <tab.icon className="mr-2 h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className="
              md:col-span-10 
              bg-white dark:bg-gray-800 
              rounded-2xl shadow-xl p-6
              order-1 md:order-2
              text-gray-800 dark:text-gray-100
            "
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[600px]"
              >
                {activeTab === "dashboard" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold">Quick Overview</h2>
                    <AnalyticsSummary />
                    <DashboardStats />
                    
                    {/* Additional Dashboard Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <motion.div 
                        className="
                          bg-blue-50 dark:bg-blue-900/50
                          rounded-2xl p-6
                          border border-blue-100 dark:border-blue-800
                        "
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Zap className="text-blue-600 dark:text-blue-300" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
                            Recent Activity
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-200">
                          No recent activities
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="
                          bg-green-50 dark:bg-green-900/50
                          rounded-2xl p-6
                          border border-green-100 dark:border-green-800
                        "
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <TrendingUp className="text-green-600 dark:text-green-300" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-200">
                            Performance
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-200">
                          All systems running smoothly
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                {activeTab === "analytics" && <AnalyticsDashboard />}
                {activeTab === "messages" && <MessageList />}
                {activeTab === "projects" && <ProjectManager />}
                {activeTab === "blog" && <BlogManager />}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <ProfileManager />
                    <HobbiesManager />
                    <EducationManager />
                    <SocialLinksManager />
                  </div>
                )}
                {activeTab === "timeline" && <TimelineManager />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminDashboard;
