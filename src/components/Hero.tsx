import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import * as Icons from "lucide-react";

export const Hero = () => {
  const { toast } = useToast();
  const { data: profileData } = useQuery({
    queryKey: ["profile-data"],
    queryFn: async () => {
      console.log("Fetching profile data...");
      const { data, error } = await supabase
        .from("profile_data")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile data:", error);
        throw error;
      }
      console.log("Profile data fetched:", data);
      return data;
    },
  });

  const { data: socialLinks } = useSocialLinks();

  const handleDownloadCV = async () => {
    if (!profileData?.resume_url) {
      toast({
        title: "No CV available",
        description: "CV has not been uploaded yet.",
      });
      return;
    }

    try {
      toast({
        title: "Downloading CV",
        description: "Your download will begin shortly...",
      });

      const response = await fetch(profileData.resume_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "YourName_CV.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download complete",
        description: "CV has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download CV. Please try again.",
      });
    }
  };

  const renderSocialIcon = (iconKey: string) => {
    const IconComponent = (Icons as any)[
      iconKey.charAt(0).toUpperCase() + iconKey.slice(1)
    ];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <section className="flex h-screen items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="z-10 space-y-8 text-center"
      >
        {/* Profile Image with Animation */}
        {profileData?.profile_image_url && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="relative mx-auto"
          >
            <div className="relative w-32 h-32">
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <img
                src={profileData.profile_image_url}
                alt="Profile"
                className="relative w-32 h-32 rounded-full border-4 border-primary object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Name with Animated Highlight */}
        <motion.h1
          className="text-4xl font-bold sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Hi, I'm{" "}
          <span className="relative inline-block text-primary">
            {profileData?.about_text || "Prince Kyeremeh"}
            <motion.span
              className="absolute -inset-1 -z-10 rounded-lg bg-primary/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </span>
        </motion.h1>

        {/* Role Description with Typing Effect */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mx-auto max-w-2xl text-xl text-muted-foreground sm:text-2xl"
        >
          Data Engineer & Full Stack Developer
          <span className="block text-primary opacity-80">
            specializing in Android Development with Jetpack Compose
          </span>
        </motion.p>

        {/* Social Links */}
        <TooltipProvider>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-4 pt-4 pb-8"
          >
            {socialLinks?.map((link) => (
              <Tooltip key={link.id}>
                <TooltipTrigger asChild>
                  <motion.a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-full bg-primary/10 p-3 text-primary transition-colors hover:bg-primary/20"
                  >
                    {renderSocialIcon(link.icon_key)}
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>
                  <p>Connect on {link.platform}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </motion.div>
        </TooltipProvider>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative overflow-hidden bg-primary px-6 py-2"
            >
              <span className="relative z-10">View My Work</span>
              <motion.div
                className="absolute inset-0 bg-primary-foreground"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.3 }}
              />
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handleDownloadCV}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10">Download CV</span>
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.3 }}
              />
              <FileText className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-primary"
          >
            <ArrowDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
