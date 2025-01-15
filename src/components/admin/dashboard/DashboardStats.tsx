import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Laptop, Newspaper, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  icon: any;
  value: number;
  label: string;
  bgColor: string;
  textColor: string;
}

const StatCard = ({ icon: Icon, value, label, bgColor, textColor }: StatCardProps) => (
  <motion.div 
    className={`
      relative overflow-hidden rounded-2xl shadow-lg p-6 
      flex items-center justify-between 
      transform transition-all duration-300 hover:scale-105
      ${bgColor} ${textColor}
    `}
    whileHover={{ 
      scale: 1.05,
      rotate: 2
    }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      type: "spring", 
      stiffness: 300,
      delay: Math.random() * 0.5
    }}
  >
    <div className="z-10 space-y-2">
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-sm opacity-80">{label}</p>
    </div>
    <Icon className="w-12 h-12 opacity-50 absolute right-4 top-4" />
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 opacity-20" />
  </motion.div>
);

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    messages: 0,
    projects: 0,
    blogs: 0,
    experiences: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [messagesCount, projectsCount, blogsCount, experiencesCount] = await Promise.all([
        supabase.from('contact_submissions').select('*', { count: 'exact' }),
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('blogs').select('*', { count: 'exact' }),
        supabase.from('experiences').select('*', { count: 'exact' })
      ]);

      setStats({
        messages: messagesCount.count || 0,
        projects: projectsCount.count || 0,
        blogs: blogsCount.count || 0,
        experiences: experiencesCount.count || 0
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        icon={MessageCircle} 
        value={stats.messages} 
        label="Messages" 
        bgColor="bg-indigo-600" 
        textColor="text-white" 
      />
      <StatCard 
        icon={Laptop} 
        value={stats.projects} 
        label="Projects" 
        bgColor="bg-green-600" 
        textColor="text-white" 
      />
      <StatCard 
        icon={Newspaper} 
        value={stats.blogs} 
        label="Blogs" 
        bgColor="bg-pink-600" 
        textColor="text-white" 
      />
      <StatCard 
        icon={Clock} 
        value={stats.experiences} 
        label="Experiences" 
        bgColor="bg-orange-600" 
        textColor="text-white" 
      />
    </div>
  );
};