import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, ExternalLink } from "lucide-react";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

type ProjectType = "all" | "web" | "android";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack web application built with React and Node.js",
    longDescription: "A comprehensive e-commerce platform with real-time inventory management, secure payment processing, and an intuitive admin dashboard.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "https://github.com",
    demo: "https://demo.com",
    type: "web",
    features: [
      "Real-time inventory tracking",
      "Secure payment processing",
      "Admin dashboard",
      "Order management"
    ]
  },
  {
    title: "Fitness Tracking App",
    description: "An Android app for tracking workouts and nutrition",
    longDescription: "A comprehensive fitness tracking application built with Jetpack Compose, featuring workout planning, progress tracking, and nutrition monitoring.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    tech: ["Kotlin", "Jetpack Compose", "Room DB"],
    github: "https://github.com",
    demo: "https://demo.com",
    type: "android",
    features: [
      "Workout tracking",
      "Nutrition monitoring",
      "Progress visualization",
      "Custom workout plans"
    ]
  },
];

export const Projects = () => {
  const [selectedType, setSelectedType] = useState<ProjectType>("all");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = projects.filter(
    (project) => selectedType === "all" || project.type === selectedType
  );

  return (
    <section id="projects" className="py-20">
      <h2 className="mb-8 text-center text-3xl font-bold">Featured Projects</h2>
      
      <Tabs
        defaultValue="all"
        className="w-full mb-12"
        onValueChange={(value) => setSelectedType(value as ProjectType)}
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="android">Android</TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto p-8 rounded-lg border-2 border-dashed border-muted">
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">
                Projects for this category will be added soon. Check back later!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-8 md:grid-cols-2"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="project-card cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="mb-6 h-48 w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                  <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                  <p className="mb-4 text-muted-foreground">{project.description}</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="skill-item">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" asChild>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </a>
                    </Button>
                    <Button asChild>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};