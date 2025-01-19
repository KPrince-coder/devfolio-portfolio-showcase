import React from "react";
import { Editor } from "@tiptap/react";
import { HexColorPicker } from "react-colorful";
import { Eraser } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColorPickerProps {
  editor: Editor;
  type: "text" | "highlight";
  color: string;
  onChange: (color: string) => void;
  trigger: React.ReactNode;
}

const presetColors = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#eab308",
  "#ec4899",
  "#8b5cf6",
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  editor,
  type,
  color,
  onChange,
  trigger,
}) => {
  const setColor = (newColor: string) => {
    onChange(newColor);
    if (type === "text") {
      editor.chain().focus().setColor(newColor).run();
    } else {
      editor.chain().focus().setHighlight({ color: newColor }).run();
    }
  };

  const clearColor = () => {
    onChange("");
    if (type === "text") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
  };

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{type === "text" ? "Text Color" : "Highlight Color"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-3">
          <HexColorPicker color={color} onChange={setColor} />

          <div className="grid grid-cols-8 gap-1">
            {presetColors.map((presetColor) => (
              <TooltipProvider key={presetColor}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-6 w-6 p-0 rounded-sm"
                      style={{
                        backgroundColor: presetColor,
                        border:
                          color === presetColor ? "2px solid black" : "none",
                      }}
                      onClick={() => setColor(presetColor)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{presetColor}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={clearColor}
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear Color</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
