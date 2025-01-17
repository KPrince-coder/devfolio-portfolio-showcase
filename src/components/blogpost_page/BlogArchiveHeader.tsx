import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Home, Search } from "lucide-react";
import { ViewToggle } from "./ViewToggle";
import { TagFilterInput } from "./TagFilterInput";

interface BlogArchiveHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedTags: string[];
  onClearTags: () => void;
  allTags: string[];
  onToggleTag: (tag: string) => void;
  isScrolled: boolean;
}

export const BlogArchiveHeader = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  selectedTags,
  onClearTags,
  allTags,
  onToggleTag,
  isScrolled,
}: BlogArchiveHeaderProps) => {
  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        isScrolled ? "h-[4.5rem]" : "h-16"
      } transition-all duration-200`}
    >
      <div className="container h-full flex items-center justify-between gap-4 transition-all duration-200">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0"
              aria-label="Go to home page"
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          
          {isScrolled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 flex-1 max-w-3xl"
            >
              <div className="relative flex-grow">
                <Button
                  variant="outline"
                  size="default"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    "h-10 px-3 py-2", // Match the height and padding of other inputs
                    "focus-visible:ring-offset-2",
                    "relative pl-10" // Space for the search icon
                  )}
                  asChild
                >
                  <div role="searchbox">
                    <Search 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                      aria-hidden="true"
                    />
                    <Input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full bg-transparent"
                      aria-label="Search posts"
                    />
                  </div>
                </Button>
              </div>

              <TagFilterInput
                allTags={["All", ...allTags]}
                selectedTags={selectedTags}
                onToggleTag={onToggleTag}
                onClearTags={onClearTags}
              />
            </motion.div>
          )}
        </div>

        {isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
          </motion.div>
        )}
      </div>
    </header>
  );
};
