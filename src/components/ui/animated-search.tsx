import { Search } from "lucide-react";
import { Input } from "./input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
}

export const AnimatedSearch = ({
  onSearch,
  className,
  ...props
}: AnimatedSearchProps) => {
  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary-teal" />
      <motion.div
        className="absolute -inset-px rounded-md border-2 border-transparent bg-gradient-to-r from-primary-teal to-secondary-blue opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
        layoutId="searchBorder"
      />
      <Input
        type="search"
        className={cn(
          "pl-10 pr-4 transition-all duration-300 bg-transparent",
          "placeholder:text-muted-foreground/70",
          "border-muted/40 hover:border-primary-teal/40 focus:border-transparent",
          className
        )}
        onChange={(e) => onSearch(e.target.value)}
        {...props}
      />
    </motion.div>
  );
};
