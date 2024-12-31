import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { ParticlesBackground } from "./ParticlesBackground";

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center overflow-hidden">
      <ParticlesBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 z-10"
      >
        <h1 className="text-4xl font-bold sm:text-6xl">
          Hi, I'm <span className="text-primary">Your Name</span>
        </h1>
        <p className="text-xl text-muted-foreground sm:text-2xl max-w-2xl mx-auto">
          Data Engineer & Full Stack Developer specializing in Android Development with Jetpack Compose
        </p>
        <Button
          onClick={() => {
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-8"
        >
          View My Work
          <ArrowDown className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </section>
  );
};