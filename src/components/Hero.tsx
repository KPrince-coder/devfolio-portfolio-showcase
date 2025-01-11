import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, FileText } from "lucide-react";
import { ParticlesBackground } from "./ParticlesBackground";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Hero = () => {
  const { toast } = useToast();

  const { data: profileData } = useQuery({
    queryKey: ['profile-data'],
    queryFn: async () => {
      console.log('Fetching profile data...');
      const { data, error } = await supabase
        .from('profile_data')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile data:', error);
        throw error;
      }
      console.log('Profile data fetched:', data);
      return data;
    }
  });

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
      const a = document.createElement('a');
      a.href = url;
      a.download = "YourName_CV.pdf"; // This will be the downloaded file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download complete",
        description: "CV has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download CV. Please try again.",
      });
    }
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
            {profileData?.about_text || "Your Name"}
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
        {profileData?.profile_image_url && (
          <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
            <img
              src={profileData.profile_image_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        )}
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