import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

export const CursorLight = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<"default" | "link" | "text">("default");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Update cursor variant based on element under cursor
    const handleElementDetection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("button") || target.closest("a")) {
        setCursorVariant("link");
      } else if (target.tagName === "P" || target.tagName === "SPAN" || target.tagName === "H1" || target.tagName === "H2" || target.tagName === "H3") {
        setCursorVariant("text");
      } else {
        setCursorVariant("default");
      }
    };

    window.addEventListener("mousemove", (e) => {
      updateMousePosition(e);
      handleElementDetection(e);
    });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const variants = {
    default: {
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "2px solid rgba(255, 255, 255, 0.8)",
      x: mousePosition.x,
      y: mousePosition.y,
    },
    link: {
      scale: 1.2,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "2px solid rgba(255, 255, 255, 1)",
      x: mousePosition.x,
      y: mousePosition.y,
    },
    text: {
      scale: 2,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      x: mousePosition.x,
      y: mousePosition.y,
    },
  };

  return (
    <>
      {/* Main cursor light effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        animate={{
          opacity: isHovering ? 1 : 0.8,
          transition: { duration: 0.15 },
        }}
        style={{
          background: `
            radial-gradient(
              ${isClicking ? "400px" : "600px"} circle at ${mousePosition.x}px ${mousePosition.y}px,
              ${isDarkMode 
                ? `rgba(229, 222, 255, ${isClicking ? "0.1" : "0.07"}),
                   rgba(172, 224, 249, ${isClicking ? "0.08" : "0.05"}) 20%,
                   rgba(45, 212, 191, ${isClicking ? "0.05" : "0.03"}) 40%,`
                : `rgba(229, 222, 255, ${isClicking ? "0.15" : "0.1"}),
                   rgba(172, 224, 249, ${isClicking ? "0.12" : "0.08"}) 20%,
                   rgba(45, 212, 191, ${isClicking ? "0.08" : "0.05"}) 40%,`
              }
              transparent 60%
            )
          `,
        }}
      />

      {/* Custom cursor */}
      <motion.div
        className="pointer-events-none fixed z-50 mix-blend-difference"
        animate={cursorVariant}
        variants={variants}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          mass: 0.5,
        }}
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          position: "fixed",
          top: -15,
          left: -15,
        }}
      >
        {/* Inner dot */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{
            scale: isClicking ? 0.5 : 1,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
          }}
        />
      </motion.div>
    </>
  );
};