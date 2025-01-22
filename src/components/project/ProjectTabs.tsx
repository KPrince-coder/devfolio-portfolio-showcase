import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Blocks, Code2, Layers, Sparkles } from "lucide-react";

export type ProjectType = "all" | "web" | "android" | "data";

interface ProjectTypeInfo {
  label: string;
  icon: any;
  color: string;
  description: string;
  bgColor: string;
}

export const projectTypes: Record<string, ProjectTypeInfo> = {
  all: {
    label: "All Projects",
    icon: Blocks,
    color: "from-primary-teal to-accent-coral",
    bgColor: "group-hover:shadow-teal-500/20",
    description: "Explore all my featured projects across different domains",
  },
  web: {
    label: "Web Development",
    icon: Code2,
    color: "from-primary-teal to-primary-mint",
    bgColor: "group-hover:shadow-mint-500/20",
    description: "Modern web applications built with cutting-edge technologies",
  },
  android: {
    label: "Android Development",
    icon: Layers,
    color: "from-accent-coral to-secondary-blue",
    bgColor: "group-hover:shadow-blue-500/20",
    description:
      "Native Android apps focused on performance and user experience",
  },
  data: {
    label: "Data Engineering",
    icon: Sparkles,
    color: "from-secondary-blue to-primary-teal",
    bgColor: "group-hover:shadow-teal-500/20",
    description: "Data processing and analytics solutions",
  },
};

interface ProjectTabsProps {
  selectedType: ProjectType;
  onTypeChange: (type: ProjectType) => void;
}

export const ProjectTabs = ({
  selectedType,
  onTypeChange,
}: ProjectTabsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      role="tablist"
      aria-label="Project type filters"
      className="w-full max-w-5xl mx-auto px-4 mb-16"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {Object.entries(projectTypes).map(([type, info]) => {
          const Icon = info.icon;
          const isSelected = selectedType === type;

          return (
            <motion.button
              key={type}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`${type}-panel`}
              id={`${type}-tab`}
              onClick={() => onTypeChange(type as ProjectType)}
              className={cn(
                "group relative w-full rounded-xl p-3 md:p-4",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal",
                "transition-all duration-300 ease-out",
                isSelected ? "scale-100" : "hover:scale-105",
                "bg-gradient-to-br from-background to-background/50",
                "border border-primary-teal/10 hover:border-primary-teal/30",
                info.bgColor,
                "backdrop-blur-sm"
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={false}
            >
              {/* Background Gradient */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10",
                  "transition-opacity duration-300",
                  `bg-gradient-to-br ${info.color}`
                )}
              />

              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-center gap-2 md:gap-3">
                {/* Icon with Dynamic Animation */}
                <motion.div
                  className={cn(
                    "p-2 md:p-3 rounded-lg",
                    "bg-gradient-to-br from-background to-background/50",
                    "border border-primary-teal/10 group-hover:border-primary-teal/30",
                    "transition-all duration-300"
                  )}
                  animate={
                    isSelected ? { rotate: [0, 360], scale: [1, 1.1, 1] } : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>

                {/* Text Content */}
                <div className="text-center">
                  <h3 className="text-sm md:text-base font-medium">
                    {isMobile ? info.label.split(" ")[0] : info.label}
                  </h3>
                  {isSelected && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-muted-foreground mt-1 line-clamp-2"
                    >
                      {info.description}
                    </motion.p>
                  )}
                </div>

                {/* Active Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className={cn(
                      "absolute -bottom-px left-0 right-0 h-0.5",
                      `bg-gradient-to-r ${info.color}`
                    )}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
