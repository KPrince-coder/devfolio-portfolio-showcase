import { useState, lazy, Suspense } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Github,
  ExternalLink,
  Code2,
  Blocks,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectTabs, ProjectType, projectTypes } from "./project/ProjectTabs";
import { ProjectsGrid } from "./project/ProjectCard";

// Lazy load the modal for better performance
const ProjectDetailsModal = lazy(() =>
  import("./project/ProjectDetailsModal").then((mod) => ({
    default: mod.ProjectDetailsModal,
  }))
);

const ProjectModalSkeleton = () => (
  <div className="p-6 space-y-4">
    <div className="space-y-2">
      <div className="h-6 w-3/4 bg-muted animate-pulse rounded-lg" />
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
    </div>

    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-6 w-16 bg-muted animate-pulse rounded-full" />
      ))}
    </div>

    <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-teal/10">
      <div className="flex gap-3">
        <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
        <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
      </div>
      <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
    </div>
  </div>
);

// type ProjectType = "all" | "web" | "android" | "data";

// interface ProjectTypeInfo {
//   label: string;
//   icon: any;
//   color: string;
//   description: string; // Added for SEO
// }

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
  created_at?: string;
  updated_at?: string;
  // user_id: string;
}

// const projectTypes: Record<string, ProjectTypeInfo> = {
//   all: {
//     label: "All Projects",
//     icon: Blocks,
//     color: "from-primary-teal to-accent-coral",
//     // description: "View all my featured projects across different domains",
//     description: "",
//   },
//   web: {
//     label: "Web Development",
//     icon: Code2,
//     color: "from-primary-teal to-primary-mint",
//     // description:
//     //   "Web applications built with modern frameworks and technologies",
//     description: "",
//   },
//   android: {
//     label: "Android Development",
//     icon: Layers,
//     color: "from-accent-coral to-secondary-blue",
//     // description: "Native Android applications developed with Kotlin and Java",
//     description: "",
//   },
//   data: {
//     label: "Data Engineering",
//     icon: Sparkles,
//     color: "from-secondary-blue to-primary-teal",
//     // description: "Data processing and analytics projects",
//     description: "",
//   },
// };

const categoryToType = {
  "Web Development": "web",
  "Android Development": "android",
  "Data Engineering": "data",
};

const ProjectCardSkeleton = () => (
  <Card className="group relative overflow-hidden border-primary-teal/20">
    {/* Background Effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary-teal/5 via-transparent to-accent-coral/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative p-6 space-y-4">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Tech Stack Skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>

      {/* Links Skeleton */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary-teal/10">
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </Card>
);

// const ProjectTypeSkeleton = () => (
//   <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 p-1 rounded-lg bg-muted/50">
//     {Array.from({ length: 4 }).map((_, i) => (
//       <Skeleton key={i} className="h-10 rounded-md" />
//     ))}
//   </div>
// );

export const Projects = () => {
  const [selectedType, setSelectedType] = useState<ProjectType>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { scrollYProgress } = useScroll();

  // const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  const filteredProjects = projects?.filter(
    (project) =>
      selectedType === "all" ||
      categoryToType[project.category] === selectedType
  );

  return (
    <section
      id="projects"
      className="relative py-20 lg:py-32 overflow-hidden"
      aria-label="Projects Section"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-teal/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-blue/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center relative"
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
          <h2 className="text-4xl font-bold relative">
            Featured{" "}
            <span className="bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore my portfolio of projects across different domains and
            technologies
          </p>
          <motion.div
            className="mt-4 h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Project Type Tabs */}

        <ProjectTabs
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        {/* Projects Grid */}

        <ProjectsGrid
          projects={filteredProjects || []}
          isLoading={isLoading}
          onProjectClick={setSelectedProject}
        />

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <Suspense
              fallback={
                <Dialog
                  open={!!selectedProject}
                  onOpenChange={() => setSelectedProject(null)}
                >
                  <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <ProjectModalSkeleton />
                  </DialogContent>
                </Dialog>
              }
            >
              <ProjectDetailsModal
                project={{
                  title: selectedProject.title,
                  description: selectedProject.description,
                  image: selectedProject.image_url,
                  tech: selectedProject.technologies,
                  github: selectedProject.github_url || "",
                  demo: selectedProject.live_url || "",
                  longDescription: selectedProject.description,
                  features: selectedProject.features,
                }}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="group relative overflow-hidden bg-gradient-to-br from-background via-background to-background/50 border border-primary-teal/10 hover:border-primary-teal/30 transition-all duration-300">
        {/* Image Container with Overlay */}
        <div className="relative aspect-video overflow-hidden">
          {project.image_url ? (
            <motion.img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-teal/5 to-accent-coral/5 flex items-center justify-center">
              <Code2 className="w-10 h-10 text-primary-teal/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="relative p-4">
          {/* Title with Animated Underline */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold tracking-tight text-foreground/90 group-hover:text-primary-teal transition-colors duration-300">
              {project.title}
            </h3>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-primary-teal to-accent-coral"
              initial={{ width: "0%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
              <Badge variant="outline" className="bg-accent-coral/5 text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary-teal transition-colors"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
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
              >
                <ExternalLink className="h-5 w-5" />
              </motion.a>
            )}
            <motion.button
              className="text-muted-foreground hover:text-primary-teal transition-colors ml-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View project details"
            >
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
