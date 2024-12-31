import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold sm:text-6xl">
          Hi, I'm <span className="text-primary">Your Name</span>
        </h1>
        <p className="text-xl text-muted-foreground sm:text-2xl">
          Full Stack Developer building amazing web experiences
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