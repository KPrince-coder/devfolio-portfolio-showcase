
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TagFilterInputProps {
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export function TagFilterInput({
  allTags = [],
  selectedTags = [],
  onToggleTag,
  onClearTags,
}: TagFilterInputProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredTags = React.useMemo(() => {
    const validTags = Array.isArray(allTags) ? allTags : [];
    if (!searchQuery) return validTags;
    return validTags.filter((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allTags, searchQuery]);

  const isAllSelected = React.useMemo(() => {
    const validAllTags = Array.isArray(allTags) ? allTags : [];
    const validSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];
    return validSelectedTags.length === validAllTags.length && validAllTags.length > 0;
  }, [allTags, selectedTags]);

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAllSelected) {
      onClearTags();
    } else {
      const validTags = Array.isArray(allTags) ? allTags : [];
      validTags.forEach((tag) => {
        if (!selectedTags.includes(tag)) {
          onToggleTag(tag);
        }
      });
    }
  };

  // Calculate dropdown position
  React.useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const content = dropdownRef.current.querySelector('[role="menu"]');
    
    if (!content) return;

    if (spaceBelow < 300 && spaceAbove > spaceBelow) {
      content.classList.add("bottom-full", "mb-2");
      content.classList.remove("top-full", "mt-2");
    } else {
      content.classList.add("top-full", "mt-2");
      content.classList.remove("bottom-full", "mb-2");
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2 min-w-[140px] transition-all duration-200",
              isOpen && "border-primary-teal ring-2 ring-primary-teal/20"
            )}
          >
            <Tag className="h-4 w-4" />
            <span className="truncate">
              {selectedTags.length === 0
                ? "Filter by tags"
                : `${selectedTags.length} selected`}
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 opacity-50 transition-transform duration-200",
              isOpen && "transform rotate-180"
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[280px] max-h-[400px] p-2 overflow-hidden"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="space-y-2">
            <div className="sticky top-0 bg-background pb-2">
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleSelectAll}
              >
                <div className="flex items-center gap-2">
                  {isAllSelected ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Tag className="h-4 w-4" />
                  )}
                  Select All Tags
                </div>
              </Button>
            </div>

            <DropdownMenuSeparator />

            <div className="overflow-y-auto max-h-[280px] -mx-1 px-1">
              <div className="space-y-1">
                {filteredTags.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No tags found
                  </div>
                ) : (
                  filteredTags.map((tag) => (
                    <DropdownMenuItem
                      key={tag}
                      className="cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        onToggleTag(tag);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {selectedTags.includes(tag) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Tag className="h-4 w-4" />
                        )}
                        {tag}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute left-0 top-full mt-2 flex flex-wrap gap-1 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg z-50"
          >
            {selectedTags.map((tag) => (
              <motion.div
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  variant="default"
                  className="bg-primary-teal hover:bg-primary-teal/90 cursor-pointer group whitespace-nowrap"
                  onClick={() => onToggleTag(tag)}
                >
                  <span className="truncate">{tag}</span>
                  <X className="ml-1 h-3 w-3 transition-transform group-hover:rotate-90" />
                </Badge>
              </motion.div>
            ))}

            {selectedTags.length > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                  onClick={onClearTags}
                >
                  Clear all
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
