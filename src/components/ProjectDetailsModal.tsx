import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Github,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Code2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

export const ProjectDetailsModal = ({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-background/95 backdrop-blur-lg border-primary-teal/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-teal/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-blue/5 rounded-full blur-[100px]" />
          {Array.from({ length: 10 }).map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.2} />
          ))}
        </div>

        {/* Close Button */}
        <motion.button
          className="absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm border border-primary-teal/20 text-muted-foreground hover:text-foreground transition-colors z-50"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </motion.button>

        <ScrollArea className="h-full max-h-[calc(90vh-2rem)] pr-4 relative">
          <DialogHeader className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-teal/20 rounded-full blur-3xl"
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
              <DialogTitle className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-teal via-accent-coral to-primary-mint">
                {project.title}
              </DialogTitle>
            </motion.div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Project Image */}
            <motion.div
              className="relative group rounded-lg overflow-hidden"
              whileHover="hover"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary-teal via-accent-coral to-primary-mint rounded-lg blur opacity-20 transition duration-1000"
                variants={{
                  hover: { opacity: 0.4, scale: 1.02 },
                }}
              />
              <div className="relative">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-video object-cover rounded-lg"
                  loading="lazy"
                  variants={{
                    hover: { scale: 1.05 },
                  }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent rounded-lg"
                  variants={{
                    hover: { opacity: 0.6 },
                  }}
                />
              </div>
            </motion.div>

            {/* Project Description */}
            <div className="prose prose-invert max-w-none">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                {project.longDescription || project.description}
              </motion.p>
            </div>

            {/* Features Section */}
            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold flex items-center gap-2 text-primary-teal">
                  <Sparkles className="h-5 w-5" />
                  Key Features
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  <AnimatePresence>
                    {project.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 group"
                      >
                        <ChevronRight className="h-5 w-5 text-primary-teal shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.div>
            )}

            {/* Technologies Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-primary-teal flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {project.tech.map((tech, index) => (
                    <MotionBadge
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className={cn(
                        "bg-gradient-to-r from-primary-teal/10 to-secondary-blue/10",
                        "hover:from-primary-teal/20 hover:to-secondary-blue/20",
                        "text-primary-teal border-primary-teal/20",
                        "transition-all duration-300 cursor-default"
                      )}
                    >
                      {tech}
                    </MotionBadge>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
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
                  <Github className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
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
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  <span>Live Demo</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
