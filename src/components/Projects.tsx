import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Project 1",
    description: "A full-stack web application built with React and Node.js",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    tech: ["React", "Node.js", "MongoDB"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "Project 2",
    description: "An e-commerce platform with real-time updates",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    tech: ["Next.js", "Prisma", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-20">
      <h2 className="mb-12 text-center text-3xl font-bold">Featured Projects</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.title} className="project-card">
            <img
              src={project.image}
              alt={project.title}
              className="mb-6 h-48 w-full rounded-lg object-cover"
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
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Code
                </a>
              </Button>
              <Button asChild>
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Demo
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};