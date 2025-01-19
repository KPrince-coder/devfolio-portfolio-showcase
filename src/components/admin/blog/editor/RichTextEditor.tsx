import React, { useCallback, useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Video from "tiptap-extension-video";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import { EditorToolbar } from "./EditorToolbar";
import { PreviewToggle } from "./components/PreviewToggle";
import { cn } from "@/lib/utils";
import "./styles.css";
import { Eye, Lock } from "lucide-react";

const lowlight = createLowlight(common);
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("python", python);

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  autofocus?: boolean;
  maxHeight?: string;
  onSave?: () => void;
  onInit?: (editor: any) => void;
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
  onInit,
  className,
}) => {
  const [isPreview, setIsPreview] = useState(false);
  // const [isScrollLocked, setIsScrollLocked] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Superscript,
      Subscript,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "code-block-wrapper",
        },
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

  useEffect(() => {
    if (onInit && editor) {
      onInit(editor);
    }
  }, [editor, onInit]);

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
    <div className="flex flex-col w-full h-full border rounded-lg">
      <EditorToolbar
        editor={editor}
        isPreview={isPreview}
        // isScrollLocked={isScrollLocked}
        onPreviewToggle={setIsPreview}
        isScrollLocked={false}
        onScrollLockToggle={function (value: boolean): void {
          throw new Error("Function not implemented.");
        }} // onScrollLockToggle={setIsScrollLocked}
      />
      <div
        className={cn(
          "flex-1 cursor-text min-h-[400px]",
          // isScrollLocked ? "overflow-hidden" : "overflow-auto",
          isPreview && "preview-mode"
        )}
        onClick={() => !isPreview && editor?.chain().focus().run()}
      >
        <EditorContent
          editor={editor}
          className={cn(
            "h-full",
            isPreview && "pointer-events-none select-none"
          )}
        />
      </div>
    </div>
  );
};
