import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Home, Search, Filter } from "lucide-react";
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
          <Link to="/" className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 hover:text-primary-teal"
              aria-label="Go to home page"
            >
              <Home className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">Home</span>
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
                    "h-10 px-3 py-2",
                    "focus-visible:ring-offset-2",
                    "relative pl-10",
                    "border-primary-teal/50 focus-visible:ring-primary-teal/50"
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

              <div className="flex items-center gap-2">
                <TagFilterInput
                  allTags={["All", ...allTags]}
                  selectedTags={selectedTags}
                  onToggleTag={onToggleTag}
                  onClearTags={onClearTags}
                />

                {selectedTags.length > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onClearTags}
                    className="relative h-9 w-9"
                  >
                    <Filter className="h-4 w-4 translate-y-[2px]" />
                    <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary-teal text-[9px] text-primary-foreground flex items-center justify-center shadow-sm">
                      {selectedTags.length}
                    </span>
                  </Button>
                )}
              </div>
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