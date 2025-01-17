import * as React from "react";
import { useState } from "react";
import { Check, ChevronsUpDown, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TagFilterInputProps {
  allTags?: string[];
  selectedTags?: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export function TagFilterInput({
  allTags = [], // Provide default empty array
  selectedTags = [],
  onToggleTag,
  onClearTags,
}: TagFilterInputProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out "All" from regular tags and handle search
  const regularTags = React.useMemo(() => {
    const tags = (allTags || []).filter((tag) => tag !== "All");
    if (!searchQuery) return tags;
    return tags.filter((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allTags, searchQuery]);

  const isAllSelected = selectedTags.length === allTags.length - 1; // -1 for "All" tag

  const handleSelect = React.useCallback(
    (value: string) => {
      if (value === "all") {
        if (isAllSelected) {
          onClearTags();
        } else {
          const tagsToSelect = allTags.filter((tag) => tag !== "All");
          tagsToSelect.forEach((tag) => onToggleTag(tag));
        }
      } else {
        onToggleTag(value);
      }
    },
    [isAllSelected, allTags, onToggleTag, onClearTags]
  );

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select tags"
            className="w-[200px] justify-between text-left font-normal"
          >
            <span className="flex items-center gap-2 truncate">
              <Tag className="h-4 w-4" />
              <span className="truncate">
                {selectedTags.length === 0
                  ? "Select tags..."
                  : `${selectedTags.length} selected`}
              </span>
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search tags..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[200px]">
                <CommandItem
                  value="all"
                  onSelect={() => handleSelect("all")}
                  className="font-medium"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isAllSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Tag className="mr-2 h-3 w-3" />
                  All Tags
                </CommandItem>

                <div className="px-2 py-1.5">
                  <div className="h-px bg-muted" />
                </div>

                {regularTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => handleSelect(tag)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Tag className="mr-2 h-3 w-3" />
                    {tag}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <ScrollArea className="max-w-[300px] flex-shrink">
          <div className="flex gap-1 px-1">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className="bg-primary-teal hover:bg-primary-teal/90 cursor-pointer whitespace-nowrap"
                onClick={() => onToggleTag(tag)}
              >
                {tag}
                <X className="ml-1 h-3 w-3 transition-transform hover:rotate-90" />
              </Badge>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}