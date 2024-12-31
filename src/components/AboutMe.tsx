import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileText } from "lucide-react";
import { useToast } from "./ui/use-toast";

export const AboutMe = () => {
  const { toast } = useToast();

  const handleDownloadCV = () => {
    // This is where you would implement the actual CV download
    toast({
      title: "Coming soon!",
      description: "CV download will be available shortly.",
    });
  };

  return (
    <section id="about" className="relative overflow-hidden py-20 lg:min-h-screen lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold">
            About <span className="text-primary">Me</span>
          </h2>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative mx-auto w-full max-w-md"
          >
            {/* Animated Blobs */}
            <div className="absolute -left-4 top-0 -z-10 h-72 w-72 animate-blob rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter" />
            <div className="absolute -right-4 -bottom-8 -z-10 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-yellow-300 opacity-70 mix-blend-multiply blur-xl filter" />
            <div className="absolute -bottom-4 left-20 -z-10 h-72 w-72 animate-blob animation-delay-4000 rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter" />

            {/* Profile Picture Container */}
            <div className="group relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full border-4 border-primary/20 shadow-xl transition-transform duration-300 hover:scale-105">
              <img
                src="/photo-1581091226825-a6a2a5aee158"
                alt="Professional headshot"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </motion.div>

          {/* About Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-primary/20 bg-accent/10 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-semibold">Who I Am</h3>
                <p className="leading-relaxed text-muted-foreground">
                  I'm a passionate Data Engineer & Full Stack Developer with a love for creating
                  elegant solutions to complex problems. My journey in tech has been driven by
                  curiosity and a desire to build impactful applications.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="border-primary/20 bg-accent/10 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-2xl font-semibold">My Approach</h3>
                <p className="leading-relaxed text-muted-foreground">
                  I believe in writing clean, maintainable code and creating intuitive user
                  experiences. My expertise in Android Development with Jetpack Compose allows
                  me to build modern, responsive applications.
                </p>
              </Card>
            </motion.div>

            {/* CV Download Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-start"
            >
              <Button
                onClick={handleDownloadCV}
                className="group relative overflow-hidden px-8 py-6"
                size="lg"
                aria-label="Download CV"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  Download CV
                  <Download 
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" 
                    aria-hidden="true"
                  />
                </span>
                <div className="absolute inset-0 transform bg-gradient-to-r from-primary/20 to-primary/40 transition-transform duration-300 group-hover:scale-110" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Inspirational Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="inline-block border-primary/20 bg-accent/10 p-6 backdrop-blur-sm">
            <p className="text-lg font-medium text-primary">
              "The only way to do great work is to love what you do."
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};