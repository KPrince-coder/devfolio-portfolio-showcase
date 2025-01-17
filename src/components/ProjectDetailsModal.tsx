import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, ChevronRight, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const MotionBadge = motion(Badge);

export const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-background/95 backdrop-blur-lg border-primary-teal/20">
        <ScrollArea className="h-full max-h-[calc(90vh-2rem)] pr-4">
          <DialogHeader className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-teal via-accent-coral to-primary-mint">
                {project.title}
              </DialogTitle>
            </motion.div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-teal via-accent-coral to-primary-mint rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent rounded-lg" />
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.longDescription || project.description}
              </p>
            </div>

            {project.features && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold flex items-center gap-2 text-primary-teal">
                  <Sparkles className="h-5 w-5" />
                  Key Features
                </h3>
                <ul className="grid gap-3">
                  <AnimatePresence>
                    {project.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <ChevronRight className="h-5 w-5 text-primary-teal shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-primary-teal">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {project.tech.map((tech, index) => (
                    <MotionBadge
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="bg-primary-teal/10 text-primary-teal hover:bg-primary-teal/20 transition-colors cursor-default"
                    >
                      {tech}
                    </MotionBadge>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 pt-4"
            >
              <Button
                variant="outline"
                asChild
                className="group relative overflow-hidden border-primary-teal/20 hover:border-primary-teal/40"
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="relative z-10">View Code</span>
                  <motion.div
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-teal/10 to-accent-coral/10"
                    initial={false}
                    whileHover={{ opacity: [0, 1] }}
                  />
                </a>
              </Button>
              <Button
                asChild
                className="group relative overflow-hidden bg-gradient-to-r from-primary-teal to-accent-coral hover:from-primary-teal/90 hover:to-accent-coral/90"
              >
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span>Live Demo</span>
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};