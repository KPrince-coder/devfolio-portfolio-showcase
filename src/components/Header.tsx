import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import * as Icons from "lucide-react";

const navItems = [
  { name: "Home", href: "#home", color: "from-pink-500 to-rose-500" },
  { name: "About", href: "#about", color: "from-purple-500 to-indigo-500" },
  { name: "Projects", href: "#projects", color: "from-blue-500 to-cyan-500" },
  { name: "Skills", href: "#skills", color: "from-teal-500 to-emerald-500" },
  { name: "Blog", href: "#blog", color: "from-green-500 to-lime-500" },
  { name: "Contact", href: "#contact", color: "from-amber-500 to-yellow-500" },
];

export const Header = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: socialLinks } = useSocialLinks();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => ({
        id: item.href.substring(1),
        top: document.getElementById(item.href.substring(1))?.offsetTop || 0,
      }));

      const scrollPosition = window.scrollY + 100;

      const currentSection = sections.reduce((acc, section) => {
        return scrollPosition >= section.top ? section.id : acc;
      }, sections[0].id);

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderSocialIcon = (iconKey: string) => {
    const IconComponent = (Icons as any)[iconKey.charAt(0).toUpperCase() + iconKey.slice(1)];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-accent/20">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#home"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          DevFolio
        </motion.a>

        {/* Desktop Navigation */}
        <motion.div
          className="hidden md:flex items-center space-x-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Nav Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors relative group",
                  activeSection === item.href.substring(1)
                    ? "text-primary"
                    : "hover:text-primary"
                )}
              >
                {item.name}
                {activeSection === item.href.substring(1) && (
                  <motion.div
                    layoutId="activeSection"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full bg-gradient-to-r opacity-20",
                      item.color
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks?.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-full hover:bg-accent transition-colors hover:text-primary"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {renderSocialIcon(link.icon_key)}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          initial={false}
          animate={{ rotate: isMenuOpen ? 90 : 0 }}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 top-16 bg-background/80 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container mx-auto px-4 py-8 flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-lg font-medium transition-colors",
                    activeSection === item.href.substring(1)
                      ? "bg-accent text-primary"
                      : "hover:bg-accent"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center space-x-4 pt-4">
                {socialLinks?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "p-3 rounded-full hover:bg-accent transition-colors hover:text-primary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {renderSocialIcon(link.icon_key)}
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};