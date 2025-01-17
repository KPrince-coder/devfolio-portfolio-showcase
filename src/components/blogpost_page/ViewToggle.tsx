import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onChange: (mode: "grid" | "list") => void;
}

export const ViewToggle = ({ viewMode, onChange }: ViewToggleProps) => {
  return (
    <div className="relative inline-flex bg-card rounded-lg p-1 border">
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          className="absolute inset-1 bg-primary-teal/10 rounded-md"
          initial={{ x: viewMode === "grid" ? "100%" : 0, opacity: 0 }}
          animate={{ 
            x: viewMode === "grid" ? 0 : "100%",
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 }
          }}
        />
      </AnimatePresence>
      <Button
        variant="ghost"
        size="sm"
        className={`relative px-3 py-1 transition-colors ${
          viewMode === "grid"
            ? "text-primary-teal hover:text-primary-teal font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onChange("grid")}
      >
        <Grid2X2 className="h-4 w-4 mr-2" />
        Grid
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`relative px-3 py-1 transition-colors ${
          viewMode === "list"
            ? "text-primary-teal hover:text-primary-teal font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onChange("list")}
      >
        <List className="h-4 w-4 mr-2" />
        List
      </Button>
    </div>
  );
};
