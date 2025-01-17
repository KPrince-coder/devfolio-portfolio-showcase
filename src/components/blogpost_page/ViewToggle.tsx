import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onChange: (mode: "grid" | "list") => void;
}

export const ViewToggle = ({ viewMode, onChange }: ViewToggleProps) => {
  return (
    <div className="inline-flex items-center rounded-md border bg-background p-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 p-0 rounded-sm",
          viewMode === "grid" &&
            "bg-primary-teal text-white hover:bg-primary-teal/90 hover:text-white"
        )}
        onClick={() => onChange("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 p-0 rounded-sm",
          viewMode === "list" &&
            "bg-primary-teal text-white hover:bg-primary-teal/90 hover:text-white"
        )}
        onClick={() => onChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
