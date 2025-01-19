import React, { forwardRef } from "react";
import { Editor } from "@tiptap/react";
import { FileCode } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  editor: Editor | null;
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
];

export const CodeBlock: React.FC<CodeBlockProps> = ({ editor }) => {
  if (!editor) return null;

  const setCodeBlock = (language: string = "plain") => {
    editor.chain().focus().toggleCodeBlock({ language }).run();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover>
            <PopoverTrigger asChild>
              {React.createElement(
                forwardRef<HTMLButtonElement>((props, ref) => (
                  <Button
                    {...props}
                    ref={ref}
                    variant="ghost"
                    size="sm"
                    className={editor.isActive("codeBlock") ? "bg-muted" : ""}
                  >
                    <FileCode className="h-4 w-4" />
                  </Button>
                ))
              )}
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Code Block</h4>
                <p className="text-sm text-muted-foreground">
                  Select a programming language for syntax highlighting
                </p>
                <Select
                  onValueChange={(value) => setCodeBlock(value)}
                  defaultValue="plain"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">Plain Text</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p>Insert Code Block</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
