// React and Framework imports
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';

// Third-party libraries
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';

// UI Components
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Icons
import * as Icons from "lucide-react";

// Types
interface ToolbarButton {
  icon: React.ElementType;
  label: string;
  action: () => void;
  isActive?: boolean;
  shortcut?: string;
}

interface MediaHandlers {
  handleImageInsert: (url: string) => void;
  handleVideoInsert: (url: string) => void;
  handleLinkInsert: (url: string, text?: string) => void;
  handleTableInsert: () => void;
}

interface ToolbarProps {
  editor: Editor | null;
  onPreviewToggle?: () => void;
  isPreview?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  mediaHandlers?: MediaHandlers;
}

const ToolbarButtonWithTooltip = ({ icon: Icon, label, action, isActive, shortcut }: ToolbarButton) => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger asChild>
      <Button
        type="button" // Ensure the button type is "button"
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={(e) => {
          e.preventDefault(); // Prevent default behavior
          action();
        }}
        className={`h-8 w-8 p-0 ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
      >
        {React.createElement(Icon, { className: "h-4 w-4" })}
      </Button>
    </TooltipTrigger>
    <TooltipContent 
      side="bottom" 
      className="select-none bg-popover text-popover-foreground border shadow-md"
    >
      {label} {shortcut && <span className="text-xs text-muted-foreground">({shortcut})</span>}
    </TooltipContent>
  </Tooltip>
);

export const Toolbar = ({ 
  editor, 
  onPreviewToggle, 
  isPreview, 
  onSave, 
  isSaving,
  mediaHandlers 
}: ToolbarProps) => {
  if (!editor) return null;

  const handleTextStyle = (style: string) => {
    switch (style) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        editor.chain().focus().setHeading({ level: parseInt(style[1]) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
        break;
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
    }
  };

  const formatButtons: ToolbarButton[] = [
    {
      icon: Icons.Bold,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      shortcut: "Ctrl+B",
    },
    {
      icon: Icons.Italic,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      shortcut: "Ctrl+I",
    },
    {
      icon: Icons.Underline,
      label: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      shortcut: "Ctrl+U",
    },
    {
      icon: Icons.Strikethrough,
      label: "Strikethrough",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      icon: Icons.Code,
      label: "Inline Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
    },
  ];

  const paragraphStyles = [
    { label: 'Normal', value: 'paragraph' },
    { label: 'Heading 1', value: 'h1', icon: Icons.Heading1 },
    { label: 'Heading 2', value: 'h2', icon: Icons.Heading2 },
    { label: 'Heading 3', value: 'h3', icon: Icons.Heading3 },
    { label: 'Heading 4', value: 'h4', icon: Icons.Heading4 },
    { label: 'Heading 5', value: 'h5', icon: Icons.Heading5 },
    { label: 'Heading 6', value: 'h6', icon: Icons.Heading6 },
  ];

  const alignmentButtons: ToolbarButton[] = [
    {
      icon: Icons.AlignLeft,
      label: "Align Left",
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: Icons.AlignCenter,
      label: "Align Center",
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: Icons.AlignRight,
      label: "Align Right",
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: Icons.AlignJustify,
      label: "Justify",
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
    },
  ];

  const listButtons: ToolbarButton[] = [
    {
      icon: Icons.List,
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: Icons.ListOrdered,
      label: "Numbered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: Icons.CheckSquare,
      label: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList'),
    },
  ];

  const specialBlocks: ToolbarButton[] = [
    {
      icon: Icons.Quote,
      label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      icon: Icons.FileCode,
      label: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      shortcut: "Ctrl+Alt+C", // Optional shortcut
    },
  ];

  // Add language selector for code blocks
  const CodeBlockLanguageSelector = () => {
    const languages = ['plaintext', 'typescript', 'javascript', 'html', 'css', 'json', 'markdown'];
    
    return editor.isActive('codeBlock') ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
          >
            {editor.getAttributes('codeBlock').language || 'plaintext'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages.map(lang => (
            <DropdownMenuItem
              key={lang}
              onClick={() => editor.chain().focus().setCodeBlock({ language: lang }).run()}
            >
              {lang}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ) : null;
  };

  const advancedControls: ToolbarButton[] = [
    {
      icon: Icons.Subscript,
      label: "Subscript",
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: editor.isActive('subscript'),
    },
    {
      icon: Icons.Superscript,
      label: "Superscript",
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: editor.isActive('superscript'),
    },
  ];

  const historyButtons: ToolbarButton[] = [
    {
      icon: Icons.Undo,
      label: "Undo",
      action: () => editor.chain().focus().undo().run(),
      shortcut: "Ctrl+Z",
    },
    {
      icon: Icons.Redo,
      label: "Redo",
      action: () => editor.chain().focus().redo().run(),
      shortcut: "Ctrl+Y",
    },
    {
      icon: Icons.RemoveFormatting,
      label: "Clear Formatting",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
  ];

  const ColorPicker = ({ type, label }: { type: "textColor" | "highlight", label: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState("#000000");
  
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <div 
              className="w-4 h-4 rounded-sm border"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-48 p-3"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Label>{label}</Label>
            <Input
              type="color"
              value={color}
              onChange={(e) => {
                const newColor = e.target.value;
                setColor(newColor);
                if (type === "textColor") {
                  editor?.chain().focus().setColor(newColor).run();
                } else {
                  editor?.chain().focus().toggleHighlight({ color: newColor }).run();
                }
              }}
              className="w-full h-8 p-1"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MediaDialog = ({ type }: { type: 'image' | 'video' | 'link' }) => {
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {type === 'image' && <Icons.Image className="h-4 w-4" />}
            {type === 'video' && <Icons.Video className="h-4 w-4" />}
            {type === 'link' && <Icons.Link2 className="h-4 w-4" />}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert {type}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {type === 'link' && (
              <div className="space-y-2">
                <Label>Text</Label>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Link text"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={`Enter ${type} URL`}
              />
            </div>
            <Button
              type="button"
              onClick={() => {
                if (mediaHandlers) {
                  if (type === 'image') mediaHandlers.handleImageInsert(url);
                  else if (type === 'video') mediaHandlers.handleVideoInsert(url);
                  else mediaHandlers.handleLinkInsert(url, text);
                }
                setUrl('');
                setText('');
              }}
            >
              Insert
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <TooltipProvider>
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="flex flex-wrap gap-1 p-2 border rounded-lg mb-2">
          {/* Text Style Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button" // Ensure the button type is "button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Icons.Type className="h-4 w-4" />
                <span>Style</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Text Style</DropdownMenuLabel>
              {paragraphStyles.map(style => (
                <DropdownMenuItem
                  key={style.value}
                  onClick={() => handleTextStyle(style.value)}
                  className="flex items-center gap-2"
                >
                  {style.icon && React.createElement(style.icon, { className: "h-4 w-4" })}
                  <span>{style.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Format Buttons */}
          <div className="flex gap-1 items-center border-l pl-2">
            {formatButtons.map((btn) => (
              <ToolbarButtonWithTooltip key={btn.label} {...btn} />
            ))}
          </div>

          {/* Alignment Buttons */}
          <div className="flex gap-1 items-center border-l pl-2">
            {alignmentButtons.map((btn) => (
              <ToolbarButtonWithTooltip key={btn.label} {...btn} />
            ))}
          </div>

          {/* List Buttons */}
          <div className="flex gap-1 items-center border-l pl-2">
            {listButtons.map((btn) => (
              <ToolbarButtonWithTooltip key={btn.label} {...btn} />
            ))}
          </div>

          {/* Special Blocks */}
          <div className="flex gap-1 items-center border-l pl-2">
            {specialBlocks.map((btn) => (
              <ToolbarButtonWithTooltip key={btn.label} {...btn} />
            ))}
            <CodeBlockLanguageSelector />
          </div>

          {/* Advanced Controls */}
          <div className="flex gap-1 items-center border-l pl-2">
            {advancedControls.map((btn) => (
              <ToolbarButtonWithTooltip key={btn.label} {...btn} />
            ))}
          </div>

          {/* History Controls */}
          <div className="flex gap-1 items-center border-l pl-2">
            {historyButtons.map((btn) => (
              <ToolbarButtonWithTooltip key={btn.label} {...btn} />
            ))}
          </div>

          {/* Color Picker Dropdown */}
          <div className="flex gap-2">
            <ColorPicker type="textColor" label="Text Color" />
            <ColorPicker type="highlight" label="Highlight" />
          </div>

          {/* Media Controls */}
          {mediaHandlers && (
            <div className="flex gap-1 items-center border-l pl-2">
              <MediaDialog type="image" />
              <MediaDialog type="video" />
              <MediaDialog type="link" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => mediaHandlers.handleTableInsert()}
              >
                <Icons.Table className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Preview Toggle */}
          {onPreviewToggle && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPreviewToggle}
            >
              {isPreview ? (
                <Icons.Edit className="h-4 w-4" />
              ) : (
                <Icons.Eye className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Save Button */}
          {onSave && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSave}
              className="flex items-center gap-2"
            >
              <Icons.Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
