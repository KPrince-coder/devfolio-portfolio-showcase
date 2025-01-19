import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, ExternalLink, Code2, Blocks, Layers, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the modal for better performance
const ProjectDetailsModal = lazy(() => import("./ProjectDetailsModal").then(mod => ({ default: mod.ProjectDetailsModal })));

type ProjectType = "all" | "web" | "android" | "data";

interface ProjectTypeInfo {
  label: string;
  icon: any;
  color: string;
  description: string; // Added for SEO
}

const projectTypes: Record<ProjectType, ProjectTypeInfo> = {
  all: {
    label: "All Projects",
    icon: Blocks,
    color: "from-primary-teal to-accent-coral",
    description: "View all my featured projects across different domains"
  },
  web: {
    label: "Web Development",
    icon: Code2,
    color: "from-primary-teal to-primary-mint",
    description: "Web applications built with modern frameworks and technologies"
  },
  android: {
    label: "Android Apps",
    icon: Layers,
    color: "from-accent-coral to-secondary-blue",
    description: "Native Android applications developed with Kotlin and Java"
  },
  data: {
    label: "Data Engineering",
    icon: Sparkles,
    color: "from-secondary-blue to-primary-teal",
    description: "Data processing and analytics projects"
  },
};

interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string;
  image_url: string;
  technologies: string[];
  github_url?: string;
  demo_url?: string;
  type: ProjectType;
  features: string[];
  created_at: string;
}

const ProjectCardSkeleton = () => (
  <Card className="relative group overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary-teal/5">
    <div className="relative">
      <Skeleton className="w-full aspect-video" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    <div className="p-6 space-y-4">
      <Skeleton className="h-7 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg ml-auto" />
      </div>
    </div>
  </Card>
);

const ProjectTypeSkeleton = () => (
  <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 p-1 rounded-lg bg-muted/50">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-10 rounded-md" />
    ))}
  </div>
);

export const Projects = () => {
  const [selectedType, setSelectedType] = useState<ProjectType>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data.map((project: any) => ({
        ...project,
        technologies: project.tags || [],
        type: project.category || "web",
        features: project.features || [],
        long_description: project.description
      }));
    },
  });

  const filteredProjects = projects?.filter(
    (project) => selectedType === "all" || project.type === selectedType
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
            Explore my portfolio of projects across different domains and technologies
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          {isLoading ? (
            <ProjectTypeSkeleton />
          ) : (
            <Tabs
              defaultValue="all"
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as ProjectType)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 relative">
                {Object.entries(projectTypes).map(([type, info]) => (
                  <motion.div
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TabsTrigger
                      value={type}
                      className={cn(
                        "relative w-full gap-2 group",
                        selectedType === type && "bg-gradient-to-r text-white"
                      )}
                      aria-label={info.description}
                    >
                      <info.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span className="hidden sm:inline relative">
                        {info.label}
                        <motion.span
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-current transform origin-left"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </span>
                      {selectedType === type && (
                        <motion.div
                          className={cn(
                            "absolute inset-0 -z-10 rounded-lg bg-gradient-to-r",
                            info.color
                          )}
                          layoutId="activeTab"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </Tabs>
          )}
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          style={{ y }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectCardSkeleton />
                </motion.div>
              ))
            ) : (
              filteredProjects?.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <Suspense fallback={null}>
              <ProjectDetailsModal
                project={{
                  title: selectedProject.title,
                  description: selectedProject.description || "",
                  image: selectedProject.image_url || "",
                  tech: selectedProject.technologies || [],
                  github: selectedProject.github_url || "",
                  demo: selectedProject.demo_url || "",
                  longDescription: selectedProject.long_description,
                  features: selectedProject.features
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
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card
        className="group relative h-full overflow-hidden bg-card cursor-pointer"
        onClick={onClick}
        tabIndex={0}
        role="button"
        aria-label={`View details of ${project.title}`}
        onKeyPress={(e) => e.key === 'Enter' && onClick()}
      >
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            initial={false}
            whileHover={{ scale: 1.1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <motion.h3
            className="text-xl font-semibold bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent"
            initial={false}
            whileHover={{ scale: 1.02 }}
          >
            {project.title}
          </motion.h3>
          
          <p className="text-muted-foreground line-clamp-2">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <motion.span
                key={tech}
                className="text-xs px-2 py-1 rounded-full bg-primary-teal/10 text-primary-teal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {tech}
              </motion.span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-secondary-blue/10 text-secondary-blue">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex gap-4 mt-4">
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary-teal transition-colors"
                whileHover={{ scale: 1.1 }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`View source code for ${project.title} on GitHub`}
              >
                <Github className="h-5 w-5" />
              </motion.a>
            )}
            {project.demo_url && (
              <motion.a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary-teal transition-colors"
                whileHover={{ scale: 1.1 }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`View live demo of ${project.title}`}
              >
                <ExternalLink className="h-5 w-5" />
              </motion.a>
            )}
          </div>

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary-teal/20 to-secondary-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            whileHover={{ opacity: 1 }}
          />
        </div>
      </Card>
    </motion.div>
  );
};
