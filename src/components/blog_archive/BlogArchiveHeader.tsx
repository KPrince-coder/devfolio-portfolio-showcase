import { motion } from "framer-motion";
import { Home, Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ViewToggle } from "./ViewToggle";
import { TagFilterInput } from "./TagFilterInput";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface BlogArchiveHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedTags: string[];
  onClearTags: () => void;
  allTags: string[];
  onToggleTag: (tag: string) => void;
  showControls: boolean;
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
  showControls,
}: BlogArchiveHeaderProps) => {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full backdrop-blur-sm border-b border-border/40 bg-background/80"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="sm" asChild className="group">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Home
              </Link>
            </Button>

            {/* Desktop Search */}
            {showControls && (
              <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
                <div className="h-6 border-l border-border/40" />
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Controls */}
          {showControls && (
            <div className="hidden md:flex items-center gap-4">
              <TagFilterInput
                allTags={allTags}
                selectedTags={selectedTags}
                onToggleTag={onToggleTag}
                onClearTags={onClearTags}
              />
              <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filter by Tags</label>
                    <TagFilterInput
                      allTags={allTags}
                      selectedTags={selectedTags}
                      onToggleTag={onToggleTag}
                      onClearTags={onClearTags}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">View Mode</label>
                    <ViewToggle viewMode={viewMode} onChange={onViewModeChange} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
