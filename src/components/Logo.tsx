import { motion } from "framer-motion";

interface LogoProps {
  onLogoClick: () => void;
}

export const Logo = ({ onLogoClick }: LogoProps) => {
  return (
    <motion.button
      onClick={onLogoClick}
      className="relative flex items-center gap-2 text-2xl font-bold"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-8 h-8">
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-teal via-secondary-blue to-primary-teal bg-[length:200%_100%]"
          animate={{
            backgroundPosition: ["0%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <span className="relative z-10 flex items-center justify-center w-full h-full text-background font-bold">
          D
        </span>
      </div>
      <div className="hidden sm:block">
        <span className="bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent">
          DevFolio
        </span>
      </div>
    </motion.button>
  );
};
