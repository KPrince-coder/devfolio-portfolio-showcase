import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Code, FileText, Image, Laptop, MessageSquare, User } from "lucide-react";

export const DashboardLoader = () => {
  // Animation variants for the container
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Animation variants for the floating icons
  const iconVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  // Animation variants for the pulse effect
  const pulseVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Animation variants for the rotating ring
  const ringVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Icons with their colors
  const icons = [
    { Icon: Code, color: "text-blue-500", delay: 0 },
    { Icon: Laptop, color: "text-green-500", delay: 0.2 },
    { Icon: User, color: "text-purple-500", delay: 0.4 },
    { Icon: MessageSquare, color: "text-yellow-500", delay: 0.6 },
    { Icon: FileText, color: "text-pink-500", delay: 0.8 },
    { Icon: Image, color: "text-indigo-500", delay: 1 },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-48 h-48">
        {/* Rotating outer ring */}
        <motion.div
          className="absolute inset-0"
          variants={ringVariants}
          animate="animate"
        >
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-primary rounded-full" />
        </motion.div>

        {/* Pulsing circle */}
        <motion.div
          className="absolute inset-4 bg-primary/5 rounded-full"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />

        {/* Floating icons */}
        <motion.div
          className="absolute inset-0"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {icons.map(({ Icon, color, delay }, index) => {
            const angle = (index * 360) / icons.length;
            const radius = 80; // Distance from center
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <motion.div
                key={index}
                className={cn("absolute", color)}
                style={{
                  left: "50%",
                  top: "50%",
                  x: x - 12, // Offset by half the icon size
                  y: y - 12,
                }}
                variants={iconVariants}
                transition={{ delay }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Center logo or text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 1,
            }}
            className="text-2xl font-bold text-primary"
          >
            DevFolio
          </motion.div>
        </div>
      </div>
    </div>
  );
};
