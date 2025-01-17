import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronUp } from "lucide-react";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="relative">
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main button */}
            <motion.div
              className="relative p-3 rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue hover:from-secondary-blue hover:to-primary-teal shadow-lg backdrop-blur-sm"
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                {/* Arrow animation */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ y: 0, opacity: 1 }}
                  animate={isHovered ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUp className="w-6 h-6 text-background" />
                </motion.div>
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="w-6 h-6 text-background" />
                </motion.div>
              </div>
            </motion.div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-teal/20 to-secondary-blue/20 blur-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};