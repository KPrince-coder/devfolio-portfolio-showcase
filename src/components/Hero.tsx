import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, FileText, Code, Sparkles, Terminal } from "lucide-react";
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
import { useEffect, useState } from "react";

const TechBadge = ({
  text,
  icon: Icon,
  delay = 0,
}: {
  text: string;
  icon: any;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-1 rounded-full bg-primary-teal/10 px-3 py-1 text-sm text-primary-teal hover:bg-primary-teal/20 transition-colors duration-300"
  >
    <Icon className="h-4 w-4" />
    <span>{text}</span>
  </motion.div>
);

const FloatingIcon = ({ icon: Icon, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay,
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
    }}
    className={`absolute ${className}`}
  >
    <Icon className="h-6 w-6 text-primary-teal/30" />
  </motion.div>
);

interface ProfileData {
  about_text: string;
  id: string;
  profile_image_url: string;
  resume_url: string;
  updated_at: string;
  name: string;
}

export const Hero = () => {
  const { toast } = useToast();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [typedText, setTypedText] = useState("");
  const fullText = "Building digital experiences that matter";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const { data: profileData } = useQuery<ProfileData, Error>({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_data")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as ProfileData;
    },
  });

  const { data: socialLinks } = useSocialLinks();

  const handleDownloadCV = async () => {
    if (!profileData?.resume_url) {
      toast({
        variant: "default",
        title: "CV Not Available",
        description: (
          <div className="flex flex-col gap-2">
            <p>No CV has been uploaded yet.</p>
            <p className="text-sm text-muted-foreground">
              Please check back later or contact me directly.
            </p>
          </div>
        ),
      });
      return;
    }

    try {
      // Initial toast to show download is starting
      toast({
        title: "Starting Download",
        description: (
          <div className="flex items-center gap-2">
            <Icons.FileDown className="h-4 w-4 animate-bounce" />
            <span>Preparing your download...</span>
          </div>
        ),
      });

      const response = await fetch(profileData.resume_url);
      if (!response.ok) throw new Error("Failed to fetch CV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Extract filename from URL or use a default
      const fileName =
        profileData.resume_url.split("/").pop() ||
        `${profileData.name.replace(/\s+/g, "_")}_CV.pdf`;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      // Success toast with animation
      toast({
        title: "Download Complete! 🎉",
        description: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icons.CheckCircle className="h-4 w-4 text-green-500" />
              <span>Your CV has been downloaded successfully</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Thank you for your interest!
            </p>
          </div>
        ),
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icons.XCircle className="h-4 w-4" />
              <span>Unable to download the CV</span>
            </div>
            <p className="text-sm">
              Please try again later or contact me directly.
            </p>
          </div>
        ),
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      {/* Decorative Elements */}
      <FloatingIcon icon={Code} className="left-[10%] top-[20%]" delay={0.2} />
      <FloatingIcon
        icon={Terminal}
        className="right-[15%] top-[30%]"
        delay={0.4}
      />
      <FloatingIcon
        icon={Sparkles}
        className="left-[20%] bottom-[30%]"
        delay={0.6}
      />

      {/* Gradient Backgrounds */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-teal/10 via-transparent to-secondary-blue/10 animate-gradient-x" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(45,212,191,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_60%,rgba(59,130,246,0.15),transparent)]" />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y }}
        className="relative z-10 max-w-5xl mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          {/* Profile Image */}
          {/* {profileData?.profile_image_url && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative mx-auto w-40 h-40"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-teal via-accent-coral to-primary-mint"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ padding: "3px" }}
              >
                <img
                  src={profileData.profile_image_url}
                  alt="Profile"
                  className="w-full h-full rounded-full border-4 border-background object-cover"
                />
              </motion.div>
            </motion.div>
          )} */}

          {/* Tech Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            <TechBadge text="React" icon={Icons.Atom} delay={0.6} />
            <TechBadge text="TypeScript" icon={Icons.FileCode} delay={0.7} />
            <TechBadge text="Node.js" icon={Icons.Server} delay={0.8} />
            <TechBadge text="Android" icon={Icons.Smartphone} delay={0.9} />
          </motion.div>

          {/* Name and Title */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-teal via-secondary-blue to-primary-teal">
                {profileData?.name || "Prince Kyeremeh"}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative h-8"
            >
              <p className="text-xl text-muted-foreground">
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-primary-teal ml-1"
                />
              </p>
            </motion.div>
          </div>

          {/* Social Links */}
          <TooltipProvider>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-4"
            >
              {socialLinks?.map((link, index) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(45,212,191,0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="relative p-3 rounded-xl bg-primary-teal/10 text-primary-teal transition-colors group"
                    >
                      {link.icon_key &&
                        (Icons[
                          link.icon_key as keyof typeof Icons
                        ] as React.ComponentType) &&
                        React.createElement(
                          Icons[
                            link.icon_key as keyof typeof Icons
                          ] as React.ComponentType<
                            React.SVGProps<SVGSVGElement>
                          >,
                          {
                            className: "w-5 h-5",
                          }
                        )}
                      <motion.span
                        className="absolute inset-0 rounded-xl bg-primary-teal/10 -z-10"
                        initial={false}
                        whileHover={{
                          scale: 1.3,
                          opacity: 0,
                        }}
                      />
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{link.platform}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </motion.div>
          </TooltipProvider>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
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

            <Button
              onClick={() => {
                const contactSection = document.querySelector("#contact");
                contactSection?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              size="lg"
              hasArrow
              className="border-primary-teal hover:bg-primary-teal/10 hover:text-primary-teal hover:border-primary-teal transition-colors duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ArrowDown className="w-5 h-5" />
                Contact Me
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <div className="h-10 w-6 rounded-full border-2 border-primary-teal/30 p-1">
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-primary-teal"
            />
          </div>
          <span className="text-sm text-muted-foreground">Scroll Down</span>
        </motion.div>
      </motion.div>
    </section>
  );
};
