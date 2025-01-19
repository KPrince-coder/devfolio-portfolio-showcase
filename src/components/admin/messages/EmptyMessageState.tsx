import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyMessageStateProps {
  onRefresh: () => void;
}

export const EmptyMessageState: React.FC<EmptyMessageStateProps> = ({
  onRefresh,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="relative w-24 h-24 mb-4">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Inbox className="w-12 h-12 absolute inset-0 m-auto text-primary" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Messages Yet
      </h3>
      <p className="text-muted-foreground max-w-sm mb-4">
        Your inbox is empty. When you receive messages from visitors, they will
        appear here.
      </p>
      <Button onClick={onRefresh} variant="outline" className="gap-2">
        Refresh Messages
      </Button>
    </motion.div>
  );
};
