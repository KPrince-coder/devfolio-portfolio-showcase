import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<any>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

export const Footer = () => {
  const { data: socialLinks } = useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      console.log("Fetching social links...");
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching social links:", error);
        throw error;
      }

      console.log("Social links fetched:", data);
      return data;
    },
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative mt-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-sm font-medium"
            aria-label="Back to top"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="mr-2 h-8 w-8 cursor-pointer rounded-full"
            />
            <span>Back to top</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {socialLinks?.map((link) => {
            const Icon = iconMap[link.icon_key.toLowerCase()] || iconMap.link;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-primary"
                )}
                aria-label={`Visit ${link.platform}`}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            );
          })}
        </motion.div>

        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with ❤️ using{" "}
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            React
          </a>
          .
        </p>
      </div>
    </footer>
  );
};