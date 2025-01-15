import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter, Instagram, Facebook, Youtube, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<any>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  mail: Mail,
  link: ExternalLink,
};

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About Me", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

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
    <footer className="relative mt-20 bg-gradient-to-b from-background/95 to-background border-t border-accent/20 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-xl font-bold"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-10 rounded-full"
              />
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Prince Kyeremeh
              </span>
            </motion.button>
            <p className="text-sm leading-6 text-muted-foreground max-w-md">
              Crafting innovative solutions at the intersection of technology and creativity.
            </p>
            <div className="flex space-x-6">
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
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="sr-only">{link.platform}</span>
                    <Icon className="h-6 w-6" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0"
          >
            <div>
              <h3 className="text-sm font-semibold leading-6 text-primary">Quick Links</h3>
              <ul role="list" className="mt-6 space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold leading-6 text-primary">Let's Connect</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <a
                    href="mailto:contact@example.com"
                    className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors"
                  >
                    contact@example.com
                  </a>
                </li>
                <li>
                  <span className="text-sm leading-6 text-muted-foreground">
                    Location: Your City, Country
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 border-t border-accent/10 pt-8 sm:mt-20 lg:mt-24"
        >
          <p className="text-center text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} Prince Kyeremeh. All rights reserved.
          </p>
          <p className="text-center text-xs leading-5 text-muted-foreground mt-2">
            Crafted with ❤️ using React and Tailwind CSS
          </p>
        </motion.div>
      </div>
    </footer>
  );
};