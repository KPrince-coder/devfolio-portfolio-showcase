import React from "react";
import { Editor } from "@tiptap/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Type } from "lucide-react";

interface HeadingDropdownProps {
  editor: Editor;
}

const headingLevels = [
  { value: "0", label: "Normal Text" },
  { value: "1", label: "Heading 1" },
  { value: "2", label: "Heading 2" },
  { value: "3", label: "Heading 3" },
  { value: "4", label: "Heading 4" },
  { value: "5", label: "Heading 5" },
  { value: "6", label: "Heading 6" },
];

export const HeadingDropdown: React.FC<HeadingDropdownProps> = ({ editor }) => {
  const getCurrentHeading = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) {
        return i.toString();
      }
    }
    return "0";
  };

  const handleHeadingChange = (value: string) => {
    if (value === "0") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    }
  };

  return (
    <Select onValueChange={handleHeadingChange} value={getCurrentHeading()}>
      <SelectTrigger className="w-[180px] gap-2">
        <Type className="h-4 w-4" />
        <SelectValue placeholder="Text style" />
      </SelectTrigger>
      <SelectContent>
        {headingLevels.map((level) => (
          <SelectItem key={level.value} value={level.value}>
            {level.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
