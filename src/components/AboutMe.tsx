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
    <section id="about" className="py-20 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <h2 className="text-4xl font-bold text-center mb-12">
          About <span className="text-primary">Me</span>
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative mx-auto lg:mx-0"
          >
            {/* Animated Blobs */}
            <div className="absolute -z-10 animate-blob mix-blend-multiply filter blur-xl opacity-70 bg-purple-300 top-0 -left-4 w-72 h-72 rounded-full" />
            <div className="absolute -z-10 animate-blob animation-delay-2000 mix-blend-multiply filter blur-xl opacity-70 bg-yellow-300 -bottom-8 -right-4 w-72 h-72 rounded-full" />
            <div className="absolute -z-10 animate-blob animation-delay-4000 mix-blend-multiply filter blur-xl opacity-70 bg-pink-300 -bottom-4 left-20 w-72 h-72 rounded-full" />
            
            {/* Profile Picture Container */}
            <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
              <img
                src="/photo-1581091226825-a6a2a5aee158"
                alt="Professional headshot"
                className="w-full h-full object-cover"
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
              <Card className="p-6 backdrop-blur-sm bg-accent/10 border-primary/20">
                <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
                <p className="text-muted-foreground leading-relaxed">
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
              <Card className="p-6 backdrop-blur-sm bg-accent/10 border-primary/20">
                <h3 className="text-2xl font-semibold mb-4">My Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
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
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Download CV
                  <Download className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 transform transition-transform duration-300 group-hover:scale-110" />
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="inline-block p-6 backdrop-blur-sm bg-accent/10 border-primary/20">
            <p className="text-lg text-primary font-medium">
              "The only way to do great work is to love what you do."
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};