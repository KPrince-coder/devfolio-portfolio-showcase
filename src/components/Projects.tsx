import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, ExternalLink, Code2, Blocks, Layers, Sparkles, ArrowRight } from "lucide-react";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ProjectType = "all" | "web" | "android" | "data";

interface ProjectTypeInfo {
  label: string;
  icon: any;
  color: string;
}

const projectTypes: Record<ProjectType, ProjectTypeInfo> = {
  all: { label: "All Projects", icon: Blocks, color: "from-primary-teal to-accent-coral" },
  web: { label: "Web Development", icon: Code2, color: "from-primary-teal to-primary-mint" },
  android: { label: "Android Apps", icon: Layers, color: "from-accent-coral to-secondary-blue" },
  data: { label: "Data Engineering", icon: Sparkles, color: "from-secondary-blue to-primary-teal" },
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
}

export const Projects = () => {
  const [selectedType, setSelectedType] = useState<ProjectType>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data.map((project: any) => ({
        ...project,
        technologies: project.tags || [], // Map tags to technologies
        type: project.category || "web", // Default to web type
        features: [], // Initialize empty features array
        long_description: project.description // Use description as long_description
      }));
    },
  });

  const filteredProjects = projects?.filter(
    (project) => selectedType === "all" || project.type === selectedType
  );

  return (
    <section id="projects" className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold">
            Featured <span className="bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent">Projects</span>
          </h2>
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
          <Tabs
            defaultValue="all"
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as ProjectType)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              {Object.entries(projectTypes).map(([type, info]) => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TabsTrigger
                    value={type}
                    className={cn(
                      "relative w-full gap-2",
                      selectedType === type && "bg-gradient-to-r text-white"
                    )}
                  >
                    <info.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{info.label}</span>
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
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          style={{ y }}
        >
          <AnimatePresence mode="wait">
            {filteredProjects?.map((project, index) => (
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
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetailsModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
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
        className="group relative h-full overflow-hidden bg-card"
        onClick={onClick}
      >
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0" />
          
          {/* Tech Stack Tags */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <div
                key={tech}
                className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm"
              >
                {tech}
              </div>
            ))}
            {project.technologies.length > 3 && (
              <div className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                +{project.technologies.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className="relative space-y-4 p-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Project Links */}
          <div className="flex items-center gap-4">
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-5 w-5" />
              </motion.a>
            )}
            {project.demo_url && (
              <motion.a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-5 w-5" />
              </motion.a>
            )}
          </div>

          {/* View Details Button */}
          <Button
            variant="ghost"
            className="absolute bottom-4 right-4 h-8 w-8 rounded-full p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};