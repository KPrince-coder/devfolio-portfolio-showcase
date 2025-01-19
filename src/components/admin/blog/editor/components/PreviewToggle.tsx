import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PreviewToggleProps {
  isPreview: boolean;
  onToggle: (value: boolean) => void;
  className?: string;
}

export const PreviewToggle: React.FC<PreviewToggleProps> = ({
  isPreview,
  onToggle,
  className,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            className={`h-8 w-8 p-0 ${className}`}
            pressed={isPreview}
            onPressedChange={onToggle}
          >
            {isPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isPreview ? "Exit Preview" : "Preview"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
