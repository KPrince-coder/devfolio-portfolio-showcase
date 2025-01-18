import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import * as Icons from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "./Logo";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const { data: socialLinks } = useSocialLinks();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      const sections = navItems.map((item) => {
        const element = document.getElementById(item.href.slice(1));
        return {
          id: item.href.slice(1),
          offset: element?.offsetTop || 0,
          height: element?.offsetHeight || 0,
        };
      });

      for (const section of sections.reverse()) {
        if (scrollPosition >= section.offset) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsOpen(false);
  };

  const handleNavClick = (href: string) => {
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100);
    }
    setIsOpen(false);
  };

  const renderSocialIcon = (iconKey: string) => {
    const IconComponent = (Icons as any)[
      iconKey.charAt(0).toUpperCase() + iconKey.slice(1)
    ];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || isOpen
          ? "bg-background/95 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo onLogoClick={scrollToTop} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "relative px-4 py-2 text-sm transition-colors",
                  activeSection === item.href.slice(1)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-teal/20 to-secondary-blue/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Desktop Social Links and Download CV */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                {socialLinks?.map((link) => (
                  <Tooltip key={link.id}>
                    <TooltipTrigger asChild>
                      <motion.a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {link.icon_key && renderSocialIcon(link.icon_key)}
                      </motion.a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={10}>
                      <p>Connect on {link.platform}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="h-6 w-px bg-border" />
            <motion.button
              onClick={() => window.open("/assets/cv.pdf", "_blank")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:text-primary-teal transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              <span>CV</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-2 bg-background/95 backdrop-blur-lg rounded-lg shadow-lg">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      "block w-full px-4 py-2 text-sm text-left transition-colors",
                      activeSection === item.href.slice(1)
                        ? "text-foreground bg-gradient-to-r from-primary-teal/20 to-secondary-blue/20"
                        : "text-muted-foreground hover:bg-primary-teal/10 hover:text-foreground"
                    )}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}

                {/* Mobile Social Links */}
                <div className="px-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    {socialLinks?.map((link) => (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {link.icon_key && renderSocialIcon(link.icon_key)}
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Mobile Download CV */}
                <motion.button
                  onClick={() => window.open("/assets/cv.pdf", "_blank")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-foreground hover:bg-primary-teal/10 transition-colors"
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download CV</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
