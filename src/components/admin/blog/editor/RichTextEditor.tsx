import React, { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Video from "tiptap-extension-video";
import { common, createLowlight } from "lowlight";
import { EditorToolbar } from "./EditorToolbar";
import { PreviewToggle } from "./components/PreviewToggle";
import { cn } from "@/lib/utils";
import "./styles.css";

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  autofocus?: boolean;
  maxHeight?: string;
  onSave?: () => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder,
  readOnly = false,
  autofocus = false,
  maxHeight,
  onSave,
  className,
}) => {
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Video,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editable: !readOnly && !isPreview,
    autofocus,
  });

  const handlePreviewToggle = useCallback(
    (value: boolean) => {
      setIsPreview(value);
      if (editor) {
        editor.setEditable(!value);
      }
    },
    [editor]
  );

  // Handle file paste
  React.useEffect(() => {
    if (!editor) return;

    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.indexOf("image") === 0) {
          event.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
              editor.chain().focus().setImage({ src: result }).run();
            }
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    };

    const handleDrop = (event: DragEvent) => {
      const items = event.dataTransfer?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.indexOf("image") === 0) {
          event.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
              editor.chain().focus().setImage({ src: result }).run();
            }
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    };

    editor.view.dom.addEventListener("paste", handlePaste);
    editor.view.dom.addEventListener("drop", handleDrop);

    return () => {
      editor.view.dom.removeEventListener("paste", handlePaste);
      editor.view.dom.removeEventListener("drop", handleDrop);
    };
  }, [editor]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Save
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        // Trigger save callback if needed
      }

      // Undo
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault();
        editor.commands.undo();
      }

      // Redo
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "z"
      ) {
        event.preventDefault();
        editor.commands.redo();
      }

      // Preview toggle
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        setIsPreview((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  // Handle slash commands
  React.useEffect(() => {
    if (!editor) return;

    const handleSlashCommand = (command: string) => {
      switch (command.toLowerCase()) {
        case "/h1":
          editor.chain().focus().setHeading({ level: 1 }).run();
          break;
        case "/h2":
          editor.chain().focus().setHeading({ level: 2 }).run();
          break;
        case "/h3":
          editor.chain().focus().setHeading({ level: 3 }).run();
          break;
        case "/quote":
          editor.chain().focus().toggleBlockquote().run();
          break;
        case "/code":
          editor.chain().focus().setCodeBlock().run();
          break;
        case "/table":
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
          break;
        // Add more slash commands as needed
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === " ") {
        const { from } = editor.state.selection;
        const text = editor.state.doc.textBetween(from - 10, from);
        const match = text.match(/\/\w+$/);
        if (match) {
          handleSlashCommand(match[0]);
          editor
            .chain()
            .focus()
            .deleteRange({ from: from - match[0].length, to: from })
            .run();
        }
      }
    };

    editor.view.dom.addEventListener("keyup", handleKeyUp);
    return () => editor.view.dom.removeEventListener("keyup", handleKeyUp);
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "flex h-full min-h-[400px] flex-col overflow-hidden rounded-lg border bg-background",
        className
      )}
    >
      <div className="flex items-center justify-between border-b bg-muted/50 p-1">
        {!readOnly && (
          <EditorToolbar
            editor={editor}
            isPreview={isPreview}
            onPreviewToggle={handlePreviewToggle}
          />
        )}
        <PreviewToggle
          isPreview={isPreview}
          onToggle={handlePreviewToggle}
        />
      </div>
      <div
        className={cn(
          "p-4 prose prose-sm max-w-none",
          isPreview && "prose-preview",
          className
        )}
        style={{ maxHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
