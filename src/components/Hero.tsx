import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, FileText } from "lucide-react";
import { ParticlesBackground } from "./ParticlesBackground";
import { useToast } from "@/components/ui/use-toast";

export const Hero = () => {
  const { toast } = useToast();

  const handleDownloadCV = () => {
    toast({
      title: "Coming soon!",
      description: "CV download will be available shortly.",
    });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center overflow-hidden">
      <ParticlesBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 z-10"
      >
        <motion.h1 
          className="text-4xl font-bold sm:text-6xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001
            }
          }}
        >
          Hi, I'm <span className="text-primary relative inline-block">
            Your Name
            <motion.span
              className="absolute -inset-1 rounded-lg bg-primary/20"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </span>
        </motion.h1>
        <p className="text-xl text-muted-foreground sm:text-2xl max-w-2xl mx-auto">
          Data Engineer & Full Stack Developer specializing in Android Development with Jetpack Compose
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View My Work
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleDownloadCV}>
            <FileText className="mr-2 h-4 w-4" />
            Download CV
          </Button>
        </div>
      </motion.div>
    </section>
  );
};