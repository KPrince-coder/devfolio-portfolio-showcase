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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex justify-center lg:justify-end">
              <Skeleton className="w-64 h-64 rounded-full" />
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-blue/5 rounded-full blur-3xl" />
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
          <div className="h-1 w-20 bg-gradient-to-r from-primary-teal to-secondary-blue mx-auto rounded-full mb-4" />
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ y }}
            className="relative"
          >
            <div className="relative w-48 h-48 lg:w-56 lg:h-56">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-teal/20 to-secondary-blue/20 blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-border"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={profileData.profile_image_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  loading="lazy"
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
            <h3 className="text-3xl font-bold">
              Passionate Full-Stack Developer
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {profileData.about_text}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Button
                onClick={handleDownloadCV}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue px-8 py-3 transition-transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Download CV
                </span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Goals Section */}
        <motion.div
          className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {goals.map((goal, index) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
                <motion.div
                  className="mb-4 inline-block rounded-full bg-gradient-to-r from-primary-teal/20 to-secondary-blue/20 p-3"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <goal.icon className="h-6 w-6 text-primary-teal" />
                </motion.div>
                <h4 className="mb-2 text-xl font-semibold">{goal.title}</h4>
                <p className="text-muted-foreground">{goal.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical Skills Section */}
        <div className="mt-20">
          <TechnicalProficiency />
        </div>

        {/* Education Section */}
        <div className="mt-20">
          <Education />
        </div>

        {/* Hobbies Section */}
        <div className="mt-20">
          <Hobbies />
        </div>
      </div>
    </section>
  );
};
