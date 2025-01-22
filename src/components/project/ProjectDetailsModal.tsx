import { motion } from "framer-motion";
import * as DialogPrimitive from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Github,
  ExternalLink,
  Code2,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

interface ProjectDetailsModalProps {
  project: {
    title: string;
    description: string;
    image: string;
    tech: string[];
    github: string;
    demo: string;
    longDescription?: string;
    features?: string[];
    updated_at?: string;
    created_at?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const MotionBadge = motion(Badge);

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

// Skeleton loader for modal
const ProjectModalSkeleton = () => (
  <div className="space-y-8 p-6">
    {/* Title Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-3/4" />
    </div>

    {/* Links Skeleton */}
    <div className="flex gap-3">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>

    {/* Tech Stack Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    </div>

    {/* Description Skeleton */}
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>

    {/* Features Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-36" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    </div>
  </div>
);

export const ProjectDetailsModal = ({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) => {
  if (!project) return null;

  return (
    <DialogPrimitive.Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-primary-teal/20">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-accent-coral/10 rounded-full blur-3xl" />
        </div>

        <ScrollArea className="h-full max-h-[calc(90vh-2rem)]">
          <div className="p-6">
            <Suspense fallback={<ProjectModalSkeleton />}>
              {/* Header Section with Enhanced Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 mb-8"
              >
                <div className="relative">
                  <motion.div
                    className="absolute -top-6 -left-6 w-32 h-32 bg-primary-teal/10 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <div className="relative space-y-2">
                    <motion.p
                      className="text-sm font-medium text-primary-teal tracking-wider uppercase"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Featured Project
                    </motion.p>
                    <motion.h2
                      className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-teal via-accent-coral to-primary-mint leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {project.title}
                    </motion.h2>
                  </div>
                </div>
              </motion.div>
              {/* Links Section - Without Date */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {project.github && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="group relative overflow-hidden sm:min-w-[140px]"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-teal/10 to-accent-coral/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="relative flex items-center justify-center gap-2">
                        <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">View Source</span>
                      </div>
                    </Button>
                  )}
                  {project.demo && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="group relative overflow-hidden sm:min-w-[140px]"
                      onClick={() => window.open(project.demo, "_blank")}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-accent-coral/10 to-primary-mint/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="relative flex items-center justify-center gap-2">
                        <ExternalLink className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">Live Demo</span>
                      </div>
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Innovative Tech Stack Display */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative mt-8"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-teal/5 via-accent-coral/5 to-primary-mint/5 rounded-2xl blur-xl" />
                <motion.div
                  className="relative p-6 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="p-1.5 rounded-lg bg-primary-teal/20"
                      >
                        <Code2 className="h-4 w-4 text-primary-teal" />
                      </motion.div>
                      <div>
                        <motion.h3 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-base font-semibold text-primary-teal"
                        >
                          Technologies Used
                        </motion.h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {project.tech.map((tech, index) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          whileHover={{ scale: 1.05 }}
                          className="group cursor-pointer"
                        >
                          <div className="relative overflow-hidden rounded-lg">
                            {/* Background with primary-teal */}
                            <motion.div
                              className="absolute inset-0 bg-primary-teal/10"
                              animate={{
                                opacity: [0.1, 0.15, 0.1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                            
                            {/* Glass effect container */}
                            <div className="relative py-1.5 px-2 border border-primary-teal/20 group-hover:border-primary-teal/40 transition-all duration-300">
                              {/* Floating sparkles effect */}
                              <motion.div
                                className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                animate={{
                                  rotate: [0, 90, 180, 270, 360],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <Sparkles className="w-2 h-2 text-primary-teal" />
                              </motion.div>
                              
                              {/* Tech name */}
                              <motion.p
                                className="text-xs font-medium text-center text-primary-teal"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                              >
                                {tech}
                              </motion.p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                {/* Project Image */}
                <motion.div
                  className="relative rounded-lg overflow-hidden"
                  whileHover="hover"
                >
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full aspect-video object-cover"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    variants={{
                      hover: { scale: 1.05 },
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"
                    variants={{
                      hover: { opacity: 0.4 },
                    }}
                  />
                </motion.div>

                {/* Description Section - Enhanced */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative p-6 rounded-xl bg-gradient-to-br from-accent-coral/5 via-transparent to-primary-mint/5"
                >
                  <div className="absolute inset-0 rounded-xl bg-background/40 backdrop-blur-sm" />
                  <div className="relative space-y-4">
                    <h3 className="text-xl font-semibold text-accent-coral flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Project Overview
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg leading-relaxed text-muted-foreground"
                        style={{
                          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        {project.longDescription || project.description}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>

                {/* Features Section - Enhanced */}
                {project.features && project.features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="relative p-6 rounded-xl bg-gradient-to-br from-primary-mint/5 via-transparent to-primary-teal/5"
                  >
                    <div className="absolute inset-0 rounded-xl bg-background/40 backdrop-blur-sm" />
                    <div className="relative space-y-4">
                      <h3 className="text-xl font-semibold text-primary-mint flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Key Features
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {project.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.8 + index * 0.1,
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            className="group flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-primary-mint/10 hover:border-primary-mint/30 transition-all duration-300"
                          >
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary-mint/10 to-primary-teal/10 flex items-center justify-center flex-shrink-0">
                              <ChevronRight className="h-4 w-4 text-primary-mint group-hover:translate-x-0.5 transition-transform duration-300" />
                            </div>
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </Suspense>
          </div>
        </ScrollArea>
      </DialogPrimitive.DialogContent>
    </DialogPrimitive.Dialog>
  );
};
