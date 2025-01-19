import { motion, useScroll, useTransform } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  Heart,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

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
  const { data: socialLinks } = useSocialLinks();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute h-32 w-full bg-gradient-to-t from-background to-transparent bottom-0 pointer-events-none" />

      {/* Wave decoration */}
      <div className="absolute inset-x-0 -top-16 h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwYzgwIDAgMTIwIDMyIDE2MCAzMnMxMjAtMzIgMTYwLTMyIDEyMCAzMiAxNjAgMzIgMTIwLTMyIDE2MC0zMiAxMjAgMzIgMTYwIDMyIDEyMC0zMiAxNjAtMzIgMTIwIDMyIDE2MCAzMiAxMjAtMzIgMTYwLTMyIDE2MCAzMiAxNjAgMzJ2MzJIMFYweiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0idGV4dC1wcmltYXJ5LXRlYWwvNSIvPjwvc3ZnPg==')] bg-repeat-x" />

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 lg:py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Brand Section */}
            <motion.div
              variants={footerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center lg:justify-start">
                <Logo onLogoClick={scrollToTop} />
              </div>
              <p className="text-sm leading-6 text-muted-foreground max-w-md text-center lg:text-left mx-auto lg:mx-0">
                Crafting innovative solutions at the intersection of technology
                and creativity. Let's build something amazing together.
              </p>
              <motion.div
                variants={staggerChildren}
                className="flex items-center justify-center lg:justify-start space-x-4"
              >
                <TooltipProvider>
                  {socialLinks?.map((link) => {
                    const Icon =
                      iconMap[link.icon_key.toLowerCase()] || iconMap.link;
                    return (
                      <Tooltip key={link.id}>
                        <TooltipTrigger asChild>
                          <motion.a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="group relative p-2 rounded-lg bg-gradient-to-br from-primary-teal/10 to-secondary-blue/10 text-primary-teal hover:from-primary-teal/20 hover:to-secondary-blue/20 transition-all duration-300"
                            aria-label={`Connect on ${link.platform}`}
                          >
                            <Icon className="h-5 w-5 transition-transform group-hover:rotate-12" />
                            <motion.span
                              className="absolute inset-0 rounded-lg bg-primary-teal/10 -z-10"
                              initial={false}
                              whileHover={{ scale: 1.3, opacity: 0 }}
                            />
                          </motion.a>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Connect on {link.platform}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </motion.div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={footerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h3 className="text-sm font-semibold leading-6 text-primary-teal mb-6">
                Quick Links
              </h3>
              <motion.ul variants={staggerChildren} className="space-y-4">
                {quickLinks.map((link) => (
                  <motion.li
                    key={link.name}
                    variants={footerVariants}
                    className="group"
                  >
                    <a
                      href={link.href}
                      className="inline-flex items-center text-sm leading-6 text-muted-foreground hover:text-primary-teal transition-colors"
                    >
                      <ChevronRight className="mr-2 h-4 w-4 opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={footerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h3 className="text-sm font-semibold leading-6 text-primary-teal mb-6">
                Let's Connect
              </h3>
              <motion.div variants={staggerChildren} className="space-y-4">
                <motion.div variants={footerVariants}>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start gap-2 bg-gradient-to-r from-primary-teal/10 to-secondary-blue/10 border-primary-teal/20 hover:from-primary-teal/20 hover:to-secondary-blue/20 hover:border-primary-teal/30 group"
                  >
                    <a
                      href="mailto:contact@example.com"
                      className="text-sm leading-6 text-primary-teal flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
                      contact@example.com
                    </a>
                  </Button>
                </motion.div>
                <motion.div variants={footerVariants}>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-gradient-to-r from-primary-teal/10 to-secondary-blue/10 border-primary-teal/20 group"
                    disabled
                  >
                    <span className="text-sm leading-6 text-primary-teal flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
                      Your City, Country
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer Bottom */}
          <motion.div
            style={{ opacity }}
            className="mt-8 pt-8 border-t border-primary-teal/10"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-center text-sm leading-5 text-muted-foreground">
                &copy; {new Date().getFullYear()} DevFolio. All rights reserved.
              </p>
              {/* <motion.p
                className="flex items-center text-sm leading-5 text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                Crafted with{" "}
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="mx-1 text-red-500"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </motion.span>{" "}
                using React and Tailwind CSS
              </motion.p> */}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
