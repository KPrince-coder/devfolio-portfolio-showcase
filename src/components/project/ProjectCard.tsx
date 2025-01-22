import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  ExternalLink,
  Code2,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  technologies: string[];
  category: "Data Engineering" | "Web Development" | "Android Development";
  features?: string[];
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer h-full"
      role="article"
      aria-label={`Project: ${project.title}`}
    >
      <Card className="relative h-full overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 border border-primary-teal/10 hover:border-primary-teal/30 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <motion.div
            className="w-full h-full"
            initial={false}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-teal/5 to-accent-coral/5 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-primary-teal/30" />
              </div>
            )}
          </motion.div>

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 0.8 : 0.6 }}
            transition={{ duration: 0.3 }}
          />

          {/* Category Badge */}
          <motion.div
            className="absolute top-4 right-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="bg-primary-teal/10 border-primary-teal/20 text-xs"
            >
              {project.category}
            </Badge>
          </motion.div>
        </div>

        {/* Content Container */}
        <div className="relative p-6 space-y-4">
          {/* Title with Animated Underline */}
          <div className="space-y-2">
            <motion.h3
              className="text-xl font-semibold tracking-tight text-foreground/90 group-hover:text-primary-teal transition-colors duration-300"
              initial={false}
              animate={isHovered ? { y: 0 } : { y: 0 }}
            >
              {project.title}
              <motion.div
                className="h-0.5 bg-gradient-to-r from-primary-teal to-accent-coral"
                initial={{ width: "0%" }}
                animate={isHovered ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.h3>

            {/* Description */}
            {/* <motion.p
              className="text-sm text-muted-foreground line-clamp-2"
              initial={false}
              animate={isHovered ? { opacity: 0.8 } : { opacity: 0.6 }}
            >
              {project.description}
            </motion.p> */}
          </div>

          {/* Technologies */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={false}
            animate={isHovered ? { y: 0 } : { y: 0 }}
          >
            <AnimatePresence>
              {project.technologies.slice(0, 3).map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="outline"
                    className="bg-primary-teal/5 hover:bg-primary-teal/10 text-xs border-primary-teal/20 transition-colors duration-300"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
              {project.technologies.length > 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Badge
                    variant="outline"
                    className="bg-accent-coral/5 text-xs"
                  >
                    +{project.technologies.length - 3}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Links */}
          <motion.div
            className="flex items-center justify-between pt-4 border-t border-primary-teal/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-3">
              {project.github_url && (
                <motion.a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary-teal transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View GitHub repository"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
              )}
              {project.live_url && (
                <motion.a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary-teal transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Visit live site"
                >
                  <ExternalLink className="h-5 w-5" />
                </motion.a>
              )}
            </div>

            <motion.div
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-sm font-medium text-primary-teal"
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

// Grid Container Component
export const ProjectsGrid = ({
  projects,
  isLoading,
  onProjectClick,
}: {
  projects: Project[];
  isLoading: boolean;
  onProjectClick: (project: Project) => void;
}) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          // // Loading skeleton grid
          // <motion.div
          //   className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          //   initial={{ opacity: 0 }}
          //   animate={{ opacity: 1 }}
          // >
          //   {Array.from({ length: 6 }).map((_, index) => (
          //     <motion.div
          //       key={`skeleton-${index}`}
          //       initial={{ opacity: 0, y: 20 }}
          //       animate={{ opacity: 1, y: 0 }}
          //       transition={{ duration: 0.5, delay: index * 0.1 }}
          //     >
          //       <ProjectCardSkeleton />
          //     </motion.div>
          //   ))}
          // </motion.div>
          <ProjectCardSkeleton />
        ) : (
          // Actual projects grid
          projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProjectCard
                project={project}
                onClick={() => onProjectClick(project)}
              />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Skeleton component remains the same as in your original code
