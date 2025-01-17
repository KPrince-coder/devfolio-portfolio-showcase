import { useEffect, useState } from "react";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

export const useScrollToTop = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [isOpen, setIsOpen] = useState(false);

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

  return {
    scrolled,
    activeSection,
    isOpen,
    setIsOpen,
    scrollToTop,
  };
};
