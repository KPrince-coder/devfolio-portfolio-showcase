import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Container, ISourceOptions } from "tsparticles-engine";

export const CursorLight = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = async (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      try {
        // Update tsParticles for repulsion effect
        const container = await (window as any).tsParticles.domItem(0) as Container | undefined;
        if (container && container.particles) {
          const particlesArray = container.particles.filter(() => true); // This creates an array of all particles
          particlesArray.forEach((p: any) => {
            if (p.position) {
              const dx = p.position.x - e.clientX;
              const dy = p.position.y - e.clientY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 100) {
                const force = (100 - distance) / 100;
                p.position.x += (dx / distance) * force * 5;
                p.position.y += (dy / distance) * force * 5;
              }
            }
          });
        }
      } catch (error) {
        console.error("Error updating particles:", error);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(229, 222, 255, 0.05), transparent 40%)`,
      }}
    />
  );
};