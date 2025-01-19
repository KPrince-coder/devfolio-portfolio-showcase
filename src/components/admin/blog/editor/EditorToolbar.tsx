import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table,
  Highlighter,
  CheckSquare,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  Type,
  PaintBucket,
  FileCode,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Palette,
  Eye,
  Sparkles,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { HeadingDropdown } from "./components/HeadingDropdown";
import { ColorPicker } from "./components/ColorPicker";
import { TableMenu } from "./components/TableMenu";
import { MediaUploader } from "./components/MediaUploader";
import { CodeBlock } from "./components/CodeBlock";

// interface EditorToolbarProps {
//   editor: Editor | null;
//   className?: string;
//   isPreview?: boolean;
//   onPreviewToggle?: (value: boolean) => void;
// }

interface EditorToolbarProps {
  editor: Editor | null;
  className?: string;
  isPreview: boolean;
  isScrollLocked: boolean;
  onPreviewToggle: (value: boolean) => void;
  onScrollLockToggle: (value: boolean) => void;
}

const fontFamilies = [
  { value: "inter", label: "Inter" },
  { value: "arial", label: "Arial" },
  { value: "georgia", label: "Georgia" },
  { value: "helvetica", label: "Helvetica" },
  { value: "times-new-roman", label: "Times New Roman" },
  { value: "trebuchet-ms", label: "Trebuchet MS" },
  { value: "verdana", label: "Verdana" },
];

const containerTypes = [
  { value: "info", label: "Info", icon: Info },
  { value: "warning", label: "Warning", icon: AlertTriangle },
  { value: "success", label: "Success", icon: CheckCircle2 },
  { value: "error", label: "Error", icon: XCircle },
];

const ToolbarButton = ({
  icon: Icon,
  title,
  action,
  isActive,
  disabled,
}: {
  icon: any;
  title: string;
  action: (pressed: boolean) => void;
  isActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            className="h-8 w-8 p-0"
            pressed={isActive}
            onPressedChange={action}
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  className,
  isPreview,
  onPreviewToggle,
}) => {
  const [textColor, setTextColor] = useState("");
  const [highlightColor, setHighlightColor] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  // const [isPreview, setIsPreview] = useState(false);
  // const [isScrollLocked, setIsScrollLocked] = useState(false);

  // const onScrollLockToggle = (value: boolean) => {
  //   setIsScrollLocked(value);
  //   document.body.style.overflow = value ? "hidden" : "auto";
  // };

  if (!editor) return null;

  const addContainer = (type: string) => {
    editor.chain().focus().setNode("container", { type }).run();
  };

  const toolbarItems = [
    {
      type: "group",
      label: "History",
      items: [
        {
          icon: Undo,
          title: "Undo (Ctrl+Z)",
          action: () => editor.chain().focus().undo().run(),
          disabled: !editor.can().undo(),
        },
        {
          icon: Redo,
          title: "Redo (Ctrl+Shift+Z)",
          action: () => editor.chain().focus().redo().run(),
          disabled: !editor.can().redo(),
        },
      ],
    },
    { type: "separator" },
    {
      type: "component",
      component: <HeadingDropdown editor={editor} />,
    },
    { type: "separator" },
    {
      type: "group",
      label: "Basic Formatting",
      items: [
        {
          icon: Bold,
          title: "Bold (Ctrl+B)",
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive("bold"),
        },
        {
          icon: Italic,
          title: "Italic (Ctrl+I)",
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive("italic"),
        },
        {
          icon: UnderlineIcon,
          title: "Underline (Ctrl+U)",
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive("underline"),
        },
        {
          icon: Strikethrough,
          title: "Strikethrough",
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: editor.isActive("strike"),
        },
      ],
    },
    { type: "separator" },
    {
      type: "group",
      label: "Lists",
      items: [
        {
          icon: List,
          title: "Bullet List",
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive("bulletList"),
        },
        {
          icon: ListOrdered,
          title: "Numbered List",
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive("orderedList"),
        },
        {
          icon: CheckSquare,
          title: "Task List",
          action: () => editor.chain().focus().toggleTaskList().run(),
          isActive: editor.isActive("taskList"),
        },
      ],
    },
    { type: "separator" },
    {
      type: "group",
      label: "Alignment",
      items: [
        {
          icon: AlignLeft,
          title: "Align Left",
          action: () => editor.chain().focus().setTextAlign("left").run(),
          isActive: editor.isActive({ textAlign: "left" }),
        },
        {
          icon: AlignCenter,
          title: "Align Center",
          action: () => editor.chain().focus().setTextAlign("center").run(),
          isActive: editor.isActive({ textAlign: "center" }),
        },
        {
          icon: AlignRight,
          title: "Align Right",
          action: () => editor.chain().focus().setTextAlign("right").run(),
          isActive: editor.isActive({ textAlign: "right" }),
        },
        {
          icon: AlignJustify,
          title: "Align Justify",
          action: () => editor.chain().focus().setTextAlign("justify").run(),
          isActive: editor.isActive({ textAlign: "justify" }),
        },
      ],
    },
    { type: "separator" },
    {
      type: "group",
      label: "Special",
      items: [
        {
          icon: Quote,
          title: "Blockquote",
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive("blockquote"),
        },
        {
          icon: Code,
          title: "Inline Code",
          action: () => editor.chain().focus().toggleCode().run(),
          isActive: editor.isActive("code"),
        },
        {
          icon: SubscriptIcon,
          title: "Subscript",
          action: () => editor.chain().focus().toggleSubscript().run(),
          isActive: editor.isActive("subscript"),
        },
        {
          icon: SuperscriptIcon,
          title: "Superscript",
          action: () => editor.chain().focus().toggleSuperscript().run(),
          isActive: editor.isActive("superscript"),
        },
      ],
    },
    { type: "separator" },
    {
      type: "dropdown",
      icon: Type,
      title: "Font Family",
      content: (
        <Select
          onValueChange={(value) =>
            editor.chain().focus().setFontFamily(value).run()
          }
          value={editor.getAttributes("textStyle").fontFamily}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      type: "component",
      component: (
        <ColorPicker
          editor={editor}
          type="text"
          color={textColor}
          onChange={setTextColor}
          trigger={
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Palette className="h-4 w-4" />
            </Button>
          }
        />
      ),
    },
    {
      type: "component",
      component: (
        <ColorPicker
          editor={editor}
          type="highlight"
          color={highlightColor}
          onChange={setHighlightColor}
          trigger={
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Highlighter className="h-4 w-4" />
            </Button>
          }
        />
      ),
    },
    { type: "separator" },
    {
      type: "popover",
      icon: Link,
      title: "Add Link",
      content: (
        <div className="flex flex-col gap-2 p-2 w-80">
          <Input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <Button
            onClick={() => {
              if (linkUrl) {
                editor
                  .chain()
                  .focus()
                  .setLink({ href: linkUrl, target: "_blank" })
                  .run();
                setLinkUrl("");
              }
            }}
          >
            Add Link
          </Button>
        </div>
      ),
    },
    {
      type: "component",
      component: <MediaUploader editor={editor} type="image" />,
    },
    {
      type: "component",
      component: <MediaUploader editor={editor} type="video" />,
    },
    {
      type: "component",
      component: <TableMenu editor={editor} />,
    },

    {
      type: "component",
      component: <CodeBlock editor={editor} />,
    },
    {
      type: "separator",
    },
    {
      type: "group",
      label: "View Controls",
      items: [
        {
          icon: Eye,
          title: isPreview ? "Exit Preview" : "Preview Mode",
          action: () => onPreviewToggle(!isPreview),
          isActive: isPreview,
        },
        // {
        //   icon: Lock,
        //   title: isScrollLocked ? "Unlock Scroll" : "Lock Scroll",
        //   action: () => onScrollLockToggle(!isScrollLocked),
        //   isActive: isScrollLocked,
        // },
      ],
    },
    {
      type: "dropdown",
      icon: Sparkles,
      title: "Special Blocks",
      content: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Sparkles className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Container Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {containerTypes.map((type) => {
              const Icon = type.icon;
              return (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => addContainer(type.value)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {type.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 bg-muted/50 p-1",
        className
      )}
    >
      {toolbarItems.map((item, index) => {
        if (item.type === "separator") {
          return (
            <Separator orientation="vertical" className="h-6" key={index} />
          );
        }

        if (item.type === "component") {
          return (
            <div key={index} className="flex items-center">
              {item.component}
            </div>
          );
        }

        if (item.type === "group") {
          return (
            <div key={index} className="flex items-center gap-1">
              {item.items.map((groupItem, groupIndex) => (
                <ToolbarButton
                  key={groupIndex}
                  icon={groupItem.icon}
                  title={groupItem.title}
                  action={groupItem.action}
                  isActive={groupItem.isActive}
                  disabled={groupItem.disabled}
                />
              ))}
            </div>
          );
        }

        if (item.type === "popover") {
          return (
            <Popover key={index}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Toggle size="sm" className="h-8 w-8 p-0">
                        <item.icon className="h-4 w-4" />
                      </Toggle>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent align="start" className="w-auto p-1">
                {item.content}
              </PopoverContent>
            </Popover>
          );
        }

        if (item.type === "dropdown") {
          return (
            <DropdownMenu key={index}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Toggle size="sm" className="h-8 w-8 p-0">
                        <item.icon className="h-4 w-4" />
                      </Toggle>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="start" className="w-auto p-1">
                {item.content}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <ToolbarButton
            key={index}
            icon={item.icon}
            title={item.title}
            action={() =>
              "action" in item && typeof item.action === "function"
                ? item.action()
                : undefined
            }
            isActive={
              "isActive" in item && typeof item.isActive === "boolean"
                ? item.isActive
                : false
            }
            disabled={
              "disabled" in item && typeof item.disabled === "boolean"
                ? item.disabled
                : false
            }
          />
        );
      })}
    </div>
  );
};
