import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect } from "react";
import {
  Code,
  Rocket,
  Palette,
  MousePointer,
  Briefcase,
  Award,
  GraduationCap,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Type Definition for Experience
interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  achievements: string[];
  color: string;
  icon_key: string;
}

// Icon Mapping with more options
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  rocket: Rocket,
  palette: Palette,
  briefcase: Briefcase,
  award: Award,
  graduation: GraduationCap,
  sparkles: Sparkles,
  default: Code,
};

// Floating particle effect component
const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue opacity-50"
    initial={{ scale: 0, x: 0, y: 0 }}
    animate={{
      scale: [1, 2, 1],
      x: [0, Math.random() * 100 - 50, 0],
      y: [0, Math.random() * 100 - 50, 0],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  />
);

// Timeline card skeleton component
const TimelineCardSkeleton = () => (
  <Card className="relative p-6 space-y-4 overflow-hidden border border-primary-teal/20">
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-20 rounded-full" />
      ))}
    </div>
  </Card>
);

export const Timeline = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("year", { ascending: false });

        if (error) throw error;
        setExperiences(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const toggleExperience = (id: string) => {
    setActiveExperience(activeExperience === id ? null : id);
  };

  return (
    <section
      className="py-20 pb-32 relative overflow-hidden"
      id="experience"
      aria-label="Professional Experience Timeline"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-teal/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-blue/10 rounded-full blur-[100px]" />
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center relative"
        >
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-teal/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-teal via-secondary-blue to-accent-coral bg-clip-text text-transparent">
            Professional Journey
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A timeline of my professional experience and achievements
          </p>
          <motion.div
            className="mt-4 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
        </motion.div>

        {/* Timeline Content */}
        <motion.div style={{ y }} className="relative max-w-5xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-teal/50 via-secondary-blue/50 to-accent-coral/50" />

          <div className="space-y-8">
            {isLoading
              ? // Show skeleton cards while loading
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className={cn(
                      "relative grid grid-cols-[1fr] lg:grid-cols-[1fr,1fr] gap-6",
                      index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                    )}
                  >
                    {/* Timeline dot for skeleton */}
                    <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-primary-teal/30 to-secondary-blue/30 transform -translate-x-1/2 z-10" />

                    <div
                      className={cn(
                        "relative",
                        index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-2"
                      )}
                    >
                      <TimelineCardSkeleton />
                    </div>
                  </div>
                ))
              : experiences.map((experience, index) => {
                  const Icon = iconMap[experience.icon_key] || iconMap.default;
                  const isActive = activeExperience === experience.id;

                  return (
                    <div
                      key={experience.id}
                      className={cn(
                        "relative grid grid-cols-[1fr] lg:grid-cols-[1fr,1fr] gap-6",
                        index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                      )}
                    >
                      {/* Timeline dot */}
                      <motion.div
                        className={cn(
                          "absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue transform -translate-x-1/2 z-10",
                          "top-[2.5rem]"
                        )}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          delay: index * 0.2,
                        }}
                      />

                      <motion.div
                        className={cn(
                          "relative",
                          index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-2",
                          "pl-8 lg:pl-0"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          className={cn(
                            "relative p-6 group hover:shadow-lg transition-all duration-300 cursor-pointer",
                            "hover:shadow-primary-teal/5 border-primary-teal/20",
                            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-teal/0 before:to-secondary-blue/0 before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-10",
                            "after:absolute after:bottom-2 after:right-2 after:w-8 after:h-8 after:bg-gradient-to-br after:from-primary-teal/10 after:to-secondary-blue/10 after:rounded-full after:opacity-0 after:scale-0 group-hover:after:opacity-100 group-hover:after:scale-100 after:transition-all after:duration-300",
                            isActive && "ring-2 ring-primary-teal/50"
                          )}
                          onClick={() => toggleExperience(experience.id)}
                          tabIndex={0}
                          role="button"
                          aria-expanded={isActive}
                          aria-controls={`experience-content-${experience.id}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleExperience(experience.id);
                            }
                          }}
                        >
                          {/* Floating corner indicators */}
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
                          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-secondary-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping delay-100" />

                          {/* Interactive ripple effect */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-teal/5 to-secondary-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute -inset-px border border-primary-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                          </div>

                          {/* Hover indicator text */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-teal/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1">
                            <span className="text-xs font-medium text-primary-teal whitespace-nowrap">
                              Click to expand
                            </span>
                          </div>

                          <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                              <motion.div
                                className="p-3 rounded-xl bg-gradient-to-br from-primary-teal/10 to-secondary-blue/10 backdrop-blur-sm"
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Icon className="w-6 h-6 text-primary-teal" />
                              </motion.div>
                              <div
                                className={cn(
                                  "flex-1",
                                  index % 2 === 0
                                    ? "lg:text-right"
                                    : "lg:text-left"
                                )}
                              >
                                <span className="text-sm font-medium text-primary-teal">
                                  {experience.year}
                                </span>
                                <h3 className="text-lg font-bold text-foreground">
                                  {experience.title}
                                </h3>
                                <p className="text-muted-foreground">
                                  {experience.company}
                                </p>
                              </div>
                              <motion.div
                                animate={{ rotate: isActive ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="lg:hidden"
                              >
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              </motion.div>
                            </div>

                            <p className="text-muted-foreground mb-4">
                              {experience.description}
                            </p>

                            {/* Technologies */}
                            <div className="flex flex-wrap gap-2">
                              {experience.technologies.map((tech) => (
                                <motion.span
                                  key={tech}
                                  className="px-3 py-1 text-sm rounded-full bg-gradient-to-r from-primary-teal/10 to-secondary-blue/10 text-primary-teal"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                  }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </div>

                            {/* Achievements */}
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  id={`experience-content-${experience.id}`}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-4 pt-4 border-t border-primary-teal/20"
                                >
                                  {/* Collapse indicator */}
                                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-teal/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-1">
                                    <span className="text-xs font-medium text-primary-teal whitespace-nowrap">
                                      Click to collapse
                                    </span>
                                  </div>
                                  <h4 className="font-semibold text-foreground mb-2">
                                    Key Achievements
                                  </h4>
                                  <ul className="space-y-2">
                                    {experience.achievements.map(
                                      (achievement, i) => (
                                        <motion.li
                                          key={i}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: i * 0.1 }}
                                          className="flex items-start gap-2"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-primary-teal mt-2" />
                                          <span className="text-muted-foreground">
                                            {achievement}
                                          </span>
                                        </motion.li>
                                      )
                                    )}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </Card>
                      </motion.div>
                    </div>
                  );
                })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
