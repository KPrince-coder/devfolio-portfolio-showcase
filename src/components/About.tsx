import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Code, Target, Users } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { TechnicalProficiency } from "./about/TechnicalProficiency";
import { Education } from "./about/Education";
import { Hobbies } from "./about/Hobbies";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface ProfileData {
  about_text: string;
  resume_url: string;
  profile_image_url: string;
}

export const AboutMe = () => {
  const { toast } = useToast();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: profileData, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_data")
        .select("about_text, resume_url, profile_image_url")
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-20 relative overflow-hidden">
        {/* Background skeleton effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-teal/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-blue/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto px-4">
          {/* Section Header Skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-1 w-20 mx-auto" />
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Profile Picture Skeleton */}
            <div className="relative flex justify-center items-center">
              <div className="relative">
                <Skeleton className="w-64 h-64 lg:w-80 lg:h-80 rounded-full" />
                {/* Skeleton rings */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute inset-0 rounded-full border-2 border-primary-teal/10 animate-pulse",
                      i === 0
                        ? "scale-105"
                        : i === 1
                          ? "scale-110"
                          : "scale-115"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-8">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn("h-4", i === 3 ? "w-3/4" : "w-full")}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Goals Skeleton */}
              <div className="grid gap-6 mt-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!profileData) return null;

  const handleDownloadCV = async () => {
    if (!profileData?.resume_url) {
      toast({
        title: "Resume not available",
        description: "The resume is currently being updated.",
        variant: "destructive",
      });
      return;
    }

    try {
      window.open(profileData.resume_url, "_blank");
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const goals = [
    {
      icon: Code,
      title: "Technical Excellence",
      description:
        "Continuously improving my skills in full-stack development and staying current with emerging technologies.",
    },
    {
      icon: Target,
      title: "Innovation",
      description:
        "Creating impactful solutions that solve real-world problems and enhance user experiences.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Working effectively with teams to build scalable and maintainable applications.",
    },
  ];

  return (
    <section id="about" className="relative overflow-hidden py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary-teal/5 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-blue/5 rounded-full blur-3xl"
        />
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary-teal/20 to-secondary-blue/20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <motion.div
            className="h-1 w-20 bg-gradient-to-r from-primary-teal to-secondary-blue mx-auto rounded-full mb-4"
            whileInView={{
              width: ["0%", "100%", "20%"],
              x: [-100, 0],
            }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ y }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              {/* Animated rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute inset-0 rounded-full border-2",
                    i === 0
                      ? "border-primary-teal/30"
                      : i === 1
                        ? "border-primary-teal/20"
                        : "border-secondary-blue/10"
                  )}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.4,
                  }}
                />
              ))}

              {/* Glowing background */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-teal/20 to-secondary-blue/20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              {/* Image container with hover effect */}
              <motion.div
                className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-border/50"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={profileData.profile_image_url || "/profile.jpg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "/fallback-profile.jpg";
                  }}
                />

                {/* Overlay with gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-primary-teal/10 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.h3
              className="text-3xl font-bold bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200%" }}
            >
              Passionate Full-Stack Developer
            </motion.h3>

            <motion.p
              className="text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {profileData.about_text || "I am a Developer"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button
                onClick={handleDownloadCV}
                size="lg"
                variant="default"
                className="bg-gradient-to-r from-primary-teal to-secondary-blue hover:from-secondary-blue hover:to-primary-teal transition-all duration-500"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Download CV
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Goals Section */}
        <motion.div
          className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {goals.map((goal, index) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5 border-transparent hover:border-primary-teal/20 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-teal/5 to-secondary-blue/5"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="mb-4 inline-block rounded-full bg-gradient-to-r from-primary-teal/20 to-secondary-blue/20 p-3 relative z-10"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <goal.icon className="h-6 w-6 text-primary-teal" />
                </motion.div>

                <motion.h4
                  className="mb-2 text-xl font-semibold relative z-10"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {goal.title}
                </motion.h4>

                <motion.p
                  className="text-muted-foreground relative z-10"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {goal.description}
                </motion.p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Sections */}
        <div className="mt-20 space-y-20">
          {/* Technical Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full max-w-7xl mx-auto"
          >
            <TechnicalProficiency />
          </motion.div>

          {/* Education Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full max-w-7xl mx-auto"
          >
            <Education />
          </motion.div>

          {/* Hobbies Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full max-w-7xl mx-auto"
          >
            <Hobbies />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
