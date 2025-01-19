import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Filter,
  Tag,
  User,
  X,
  Check,
  RefreshCw,
  Plus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "@/types/messages";

interface AdvancedFilterProps {
  onFilterApply: (filters: {
    dateRange: DateRange;
    tags?: string[];
    sender?: string;
    status?: "all" | "read" | "unread" | "replied";
  }) => void;
  onFilterReset?: () => void;
}

export const AdvancedMessageFilter: React.FC<AdvancedFilterProps> = ({
  onFilterApply,
  onFilterReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [sender, setSender] = useState("");
  const [status, setStatus] = useState<"all" | "read" | "unread" | "replied">(
    "all"
  );

  const handleDateRangeChange = (
    range: { from?: Date; to?: Date } | undefined
  ) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from,
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleApplyFilters = () => {
    onFilterApply({
      dateRange,
      tags,
      sender,
      status,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setDateRange({ from: new Date(), to: new Date() });
    setTags([]);
    setSender("");
    setStatus("all");
    onFilterReset?.();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {(tags.length > 0 || sender || status !== "all") && (
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Advanced Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-muted-foreground"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Date Range
            </h4>
            <CalendarComponent
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={handleDateRangeChange}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Tag className="mr-2 h-4 w-4" /> Tags
            </h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <AnimatePresence>
              {tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 pr-1"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTag(tag)}
                        className="h-4 w-4 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <User className="mr-2 h-4 w-4" /> Sender
            </h4>
            <Input
              placeholder="Search by name or email"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Status</h4>
            <Select
              value={status}
              onValueChange={(val: "all" | "read" | "unread" | "replied") =>
                setStatus(val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters} className="gap-2">
              <Check className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};
