import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code2,
  Quote,
  Minus,
  Image as ImageIcon,
  Video as VideoIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Code as CodeIcon,
  Table as TableIcon,
  FileText,
  Palette,
  LayoutTemplate,
  Braces,
  Hash,
  FileCode,
  BookOpen,
  Bookmark,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import Video from "@tiptap/extension-youtube";
import BoldExtension from "@tiptap/extension-bold";
import UnderlineExtension from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditorToolbar } from "./EditorToolbar";
import { cn } from "@/lib/utils";
import "./styles.css";

const lowlight = createLowlight(common);

const CustomCodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: "plain",
        parseHTML: (element) =>
          element.getAttribute("data-language") || "plain",
        renderHTML: (attributes) => ({
          "data-language": attributes.language || "plain",
        }),
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || "plain";
    const displayLanguage =
      language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();

    return [
      "div",
      {
        class: "code-block-wrapper",
        "data-language": displayLanguage,
      },
      ["pre", HTMLAttributes, ["code", { class: `language-${language}` }, 0]],
    ];
  },
});

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

interface SlashCommandItem {
  title: string;
  description: string;
  shortcut?: string;
  icon: any;
  command: ({ editor, range }: { editor: any; range: any }) => void;
}

interface SlashCommandCategory {
  name: string;
  items: SlashCommandItem[];
}

interface SlashCommandsListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  editor: any;
  range: any;
}

interface SuggestionProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  clientRect: () => DOMRect;
  editor: any;
  event?: KeyboardEvent;
}

interface ReactRendererRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

type ReactRendererType = {
  element: HTMLElement;
  ref: ReactRendererRef | null;
  updateProps: (props: any) => void;
  destroy: () => void;
};

const commandCategories: SlashCommandCategory[] = [
  {
    name: "Basic Formatting",
    items: [
      {
        title: "Text",
        description: "Just start writing with plain text",
        shortcut: "⌘+⌥+0",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setParagraph().run();
        },
        icon: Type,
      },
      {
        title: "Bold",
        description: "Make text bold",
        shortcut: "⌘+B",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBold().run();
        },
        icon: BoldIcon,
      },
      {
        title: "Italic",
        description: "Make text italic",
        shortcut: "⌘+I",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleItalic().run();
        },
        icon: ItalicIcon,
      },
      {
        title: "Underline",
        description: "Underline text",
        shortcut: "⌘+U",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleUnderline().run();
        },
        icon: UnderlineIcon,
      },
      {
        title: "Strikethrough",
        description: "Strike through text",
        shortcut: "⌘+⇧+X",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleStrike().run();
        },
        icon: StrikethroughIcon,
      },
    ],
  },
  {
    name: "Headings",
    items: [
      {
        title: "Heading 1",
        description: "Large section heading",
        shortcut: "⌘+⌥+1",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 1 })
            .run();
        },
        icon: Heading1,
      },
      {
        title: "Heading 2",
        description: "Medium section heading",
        shortcut: "⌘+⌥+2",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 2 })
            .run();
        },
        icon: Heading2,
      },
      {
        title: "Heading 3",
        description: "Small section heading",
        shortcut: "⌘+⌥+3",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setHeading({ level: 3 })
            .run();
        },
        icon: Heading3,
      },
    ],
  },
  {
    name: "Lists & Items",
    items: [
      {
        title: "Bullet List",
        description: "Create a simple bullet list",
        shortcut: "⌘+⌥+8",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
        icon: List,
      },
      {
        title: "Numbered List",
        description: "Create a numbered list",
        shortcut: "⌘+⌥+9",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
        icon: ListOrdered,
      },
      {
        title: "Task List",
        description: "Create a task list",
        shortcut: "⌘+⌥+T",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
        icon: CheckSquare,
      },
    ],
  },
  {
    name: "Media & Links",
    items: [
      {
        title: "Image",
        description: "Insert an image",
        shortcut: "⌘+⌥+I",
        command: ({ editor, range }) => {
          const url = window.prompt("Enter image URL");
          if (url) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setImage({ src: url })
              .run();
          }
        },
        icon: ImageIcon,
      },
      {
        title: "Video",
        description: "Insert a video",
        shortcut: "⌘+⌥+V",
        command: ({ editor, range }) => {
          const url = window.prompt("Enter video URL");
          if (url) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setVideo({ src: url })
              .run();
          }
        },
        icon: VideoIcon,
      },
      {
        title: "Link",
        description: "Insert a link",
        shortcut: "⌘+K",
        command: ({ editor, range }) => {
          const url = window.prompt("Enter URL");
          if (url) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setLink({ href: url })
              .run();
          }
        },
        icon: LinkIcon,
      },
    ],
  },
  {
    name: "Advanced Formatting",
    items: [
      {
        title: "Superscript",
        description: "Make text superscript",
        shortcut: "⌘+.",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleSuperscript().run();
        },
        icon: SuperscriptIcon,
      },
      {
        title: "Subscript",
        description: "Make text subscript",
        shortcut: "⌘+,",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleSubscript().run();
        },
        icon: SubscriptIcon,
      },
      {
        title: "Inline Code",
        description: "Format text as inline code",
        shortcut: "⌘+E",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleCode().run();
        },
        icon: CodeIcon,
      },
    ],
  },
  {
    name: "Blocks & Layout",
    items: [
      {
        title: "Code Block",
        description: "Add a code block with syntax highlighting",
        shortcut: "⌘+⌥+C",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setCodeBlock().run();
        },
        icon: Code2,
      },
      {
        title: "Table",
        description: "Insert a table",
        shortcut: "⌘+⌥+T",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
        },
        icon: TableIcon,
      },
      {
        title: "Divider",
        description: "Add a horizontal divider",
        shortcut: "⌘+⌥+D",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
        icon: Minus,
      },
    ],
  },
  {
    name: "Basic Blocks",
    items: [
      {
        title: "Quote",
        description: "Add a quote from another source (use for citations and external quotes)",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBlockquote()
            .run();
        },
        icon: Quote,
      },
    ],
  },
  {
    name: "Callout Blocks",
    items: [
      {
        title: "Note",
        description: "Add a blue note block to highlight important information",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("paragraph")
            .toggleBlockquote()
            .updateAttributes("blockquote", {
              class: "note-block",
            })
            .run();
        },
        icon: BookOpen,
      },
      {
        title: "Warning",
        description: "Add a yellow warning block for cautionary messages",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("paragraph")
            .toggleBlockquote()
            .updateAttributes("blockquote", {
              class: "warning-block",
            })
            .run();
        },
        icon: AlertTriangle,
      },
      {
        title: "Info",
        description: "Add a gray info block for additional context or details",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("paragraph")
            .toggleBlockquote()
            .updateAttributes("blockquote", {
              class: "info-block",
            })
            .run();
        },
        icon: Info,
      },
      {
        title: "Success",
        description: "Add a green success block for positive outcomes",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("paragraph")
            .toggleBlockquote()
            .updateAttributes("blockquote", {
              class: "success-block",
            })
            .run();
        },
        icon: CheckCircle2,
      },
      {
        title: "Error",
        description: "Add a red error block for critical warnings or errors",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("paragraph")
            .toggleBlockquote()
            .updateAttributes("blockquote", {
              class: "error-block",
            })
            .run();
        },
        icon: XCircle,
      },
    ],
  },
  {
    name: "Text Alignment",
    items: [
      {
        title: "Align Left",
        description: "Align text to the left",
        shortcut: "⌘+⇧+L",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setTextAlign("left").run();
        },
        icon: AlignLeft,
      },
      {
        title: "Align Center",
        description: "Center align text",
        shortcut: "⌘+⇧+E",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setTextAlign("center")
            .run();
        },
        icon: AlignCenter,
      },
      {
        title: "Align Right",
        description: "Align text to the right",
        shortcut: "⌘+⇧+R",
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setTextAlign("right").run();
        },
        icon: AlignRight,
      },
      {
        title: "Justify",
        description: "Justify align text",
        shortcut: "⌘+⇧+J",
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setTextAlign("justify")
            .run();
        },
        icon: AlignJustify,
      },
    ],
  },
  {
    name: "Special Elements",
    items: [
      {
        title: "Date",
        description: "Insert current date",
        command: ({ editor, range }) => {
          const date = new Date().toLocaleDateString();
          editor.chain().focus().deleteRange(range).insertContent(date).run();
        },
        icon: Calendar,
      },
      {
        title: "Time",
        description: "Insert current time",
        command: ({ editor, range }) => {
          const time = new Date().toLocaleTimeString();
          editor.chain().focus().deleteRange(range).insertContent(time).run();
        },
        icon: Clock,
      },
      {
        title: "Location",
        description: "Add a location block",
        command: ({ editor, range }) => {
          const location = window.prompt("Enter location");
          if (location) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent(`📍 ${location}`)
              .run();
          }
        },
        icon: MapPin,
      },
    ],
  },
  {
    name: "Contact Elements",
    items: [
      {
        title: "Email",
        description: "Add an email link",
        command: ({ editor, range }) => {
          const email = window.prompt("Enter email address");
          if (email) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setLink({ href: `mailto:${email}` })
              .insertContent(email)
              .run();
          }
        },
        icon: Mail,
      },
      {
        title: "Phone",
        description: "Add a phone number",
        command: ({ editor, range }) => {
          const phone = window.prompt("Enter phone number");
          if (phone) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setLink({ href: `tel:${phone}` })
              .insertContent(phone)
              .run();
          }
        },
        icon: Phone,
      },
      {
        title: "Website",
        description: "Add a website link",
        command: ({ editor, range }) => {
          const url = window.prompt("Enter website URL");
          if (url) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setLink({ href: url })
              .insertContent(url)
              .run();
          }
        },
        icon: Globe,
      },
    ],
  },
  {
    name: "Social Links",
    items: [
      {
        title: "Twitter",
        description: "Add Twitter profile link",
        command: ({ editor, range }) => {
          const username = window.prompt("Enter Twitter username");
          if (username) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setLink({ href: `https://twitter.com/${username}` })
              .insertContent(`@${username}`)
              .run();
          }
        },
        icon: Twitter,
      },
      {
        title: "GitHub",
        description: "Add GitHub profile link",
        command: ({ editor, range }) => {
          const username = window.prompt("Enter GitHub username");
          if (username) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setLink({ href: `https://github.com/${username}` })
              .insertContent(`@${username}`)
              .run();
          }
        },
        icon: Github,
      },
      {
        title: "LinkedIn",
        description: "Add LinkedIn profile link",
        command: ({ editor, range }) => {
          const url = window.prompt("Enter LinkedIn profile URL");
          if (url) {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .setLink({ href: url })
              .insertContent("LinkedIn Profile")
              .run();
          }
        },
        icon: Linkedin,
      },
    ],
  },
];

const getSuggestionItems = ({
  query,
}: {
  query: string;
}): SlashCommandItem[] => {
  const allItems = commandCategories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.name,
    }))
  );

  if (!query) return allItems;

  const search = query.toLowerCase();
  return allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
  );
};

const SlashCommandsList: React.FC<SlashCommandsListProps> = ({
  items,
  command,
  editor,
  range,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandsByCategory = React.useMemo(() => {
    const categorized = new Map<string, SlashCommandItem[]>();
    items.forEach((item) => {
      const category = (item as any).category || "Other";
      if (!categorized.has(category)) {
        categorized.set(category, []);
      }
      categorized.get(category)!.push(item);
    });
    return categorized;
  }, [items]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    },
    [command, items]
  );

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [items, selectedIndex, selectItem]);

  if (items.length === 0) {
    return (
      <div className="slash-command-empty">No matching commands found</div>
    );
  }

  let currentIndex = 0;
  return (
    <div className="slash-command-menu">
      {Array.from(commandsByCategory.entries()).map(
        ([category, categoryItems]) =>
          categoryItems.length > 0 ? (
            <div key={category}>
              <div className="slash-command-section">{category}</div>
              {categoryItems.map((item) => {
                const index = currentIndex++;
                return (
                  <button
                    key={index}
                    className="slash-command-item"
                    onClick={() => selectItem(index)}
                    aria-selected={index === selectedIndex}
                  >
                    <item.icon className="icon" />
                    <span className="label">{item.title}</span>
                    <span className="description">{item.description}</span>
                    {item.shortcut && (
                      <span className="shortcut">
                        <kbd>{item.shortcut}</kbd>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : null
      )}
    </div>
  );
};

const SlashCommandsExtension = Extension.create({
  name: "slash-commands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any;
          range: any;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const CustomSlashCommandsExtension = SlashCommandsExtension.configure({
  suggestion: {
    items: getSuggestionItems,
    render: () => {
      let component: ReactRendererType | null = null;
      let popup: any | null = null;

      return {
        onStart: (props: SuggestionProps) => {
          const renderer = new ReactRenderer(SlashCommandsList, {
            props,
            editor: props.editor,
          });

          component = {
            element: renderer.element as HTMLElement,
            ref: renderer.ref as ReactRendererRef | null,
            updateProps: renderer.updateProps.bind(renderer),
            destroy: renderer.destroy.bind(renderer),
          };

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },
        onUpdate: (props: SuggestionProps) => {
          component?.updateProps(props);

          popup?.[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },
        onKeyDown: (props: { event: KeyboardEvent }) => {
          if (props.event.key === "Escape") {
            popup?.[0].hide();
            return true;
          }
          return component?.ref?.onKeyDown(props) || false;
        },
        onExit: () => {
          popup?.[0].destroy();
          component?.destroy();
        },
      };
    },
  },
});

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
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
        bold: false, // Disable default bold from StarterKit
      }),
      BoldExtension.configure({
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      UnderlineExtension,
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
        HTMLAttributes: {
          class: "task-item",
        },
      }),
      CustomCodeBlock.configure({
        lowlight,
      }),
      Video,
      CustomSlashCommandsExtension,
      Extension.create({
        name: "tabHandler",
        addKeyboardShortcuts() {
          return {
            Tab: ({ editor }) => {
              const { selection } = editor.state;
              const node = selection.$anchor.parent;

              if (node.type.name === "codeBlock") {
                editor.commands.insertContent("  "); // Insert 2 spaces for tab
                return true;
              }
              return false;
            },
          };
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editable: !readOnly && !isPreview,
    autofocus,
  });

  // Handle file paste and drop
  useEffect(() => {
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
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s" && onSave) {
        event.preventDefault();
        onSave();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        setIsPreview((prev) => !prev);
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault();
        setIsScrollLocked((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, onSave]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly && !isPreview);
    }
  }, [editor, isPreview, readOnly]);

  useEffect(() => {
    if (editor && onInit) {
      onInit(editor);
    }
  }, [editor, onInit]);

  const handlePreviewToggle = (value: boolean) => {
    setIsPreview(value);
    if (editor) {
      editor.setEditable(!value);
    }
  };

  if (!editor) return null;

  return (
    <>
      <div className={cn("relative w-full", className)}>
        <EditorToolbar
          editor={editor}
          isPreview={isPreview}
          isScrollLocked={isScrollLocked}
          onPreviewToggle={handlePreviewToggle}
          onScrollLockToggle={setIsScrollLocked}
          onShowInstructions={() => setShowInstructions(true)}
        />
        <div
          className={cn("relative border rounded-md w-full cursor-text", {
            "h-[500px] overflow-auto custom-scrollbar": !isScrollLocked,
            "min-h-fit": isScrollLocked,
            "preview-mode": isPreview,
          })}
          onClick={() => !isPreview && editor?.chain().focus().run()}
        >
          <EditorContent
            editor={editor}
            className={cn(
              "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none focus:ring-0 max-w-none",
              {
                "select-none": isPreview,
              }
            )}
            placeholder={`Start writing your blog post...

Quick Guide:
• Press / to open the command menu
• Use regular blockquotes (/quote) for citations and external quotes
• Use callout blocks to highlight information:
  - Note (Blue, /note): Important information
  - Warning (Yellow, /warning): Cautionary messages
  - Info (Gray, /info): Additional context
  - Success (Green, /success): Positive outcomes
  - Error (Red, /error): Critical warnings

Type / to explore all available blocks and formatting options.`}
          />
        </div>
      </div>
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="instructions-dialog">
          <DialogHeader>
            <DialogTitle>Editor Instructions</DialogTitle>
            <DialogDescription>
              Learn how to use the rich text editor effectively
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <section>
              <h3>Basic Formatting</h3>
              <div className="text-sm text-muted-foreground">
                Use the toolbar buttons or keyboard shortcuts:
              </div>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>
                  <kbd>Ctrl</kbd> + <kbd>B</kbd> for bold
                </li>
                <li>
                  <kbd>Ctrl</kbd> + <kbd>I</kbd> for italic
                </li>
                <li>
                  <kbd>Ctrl</kbd> + <kbd>U</kbd> for underline
                </li>
              </ul>
            </section>
            <section>
              <h3>Slash Commands</h3>
              <div className="text-sm text-muted-foreground">
                Type <kbd>/</kbd> to open the command menu. Available commands:
              </div>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Text - Start a new paragraph</li>
                <li>Heading - Create headings (levels 1-6)</li>
                <li>List - Create bullet or numbered lists</li>
                <li>Code - Insert code blocks</li>
                <li>Quote - Add block quotes</li>
              </ul>
            </section>
            <section>
              <h3>Special Features</h3>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>
                  Preview Mode (<kbd>Ctrl</kbd> + <kbd>P</kbd>) - Toggle to see
                  how content will appear
                </li>
                <li>
                  Scroll Lock (<kbd>Ctrl</kbd> + <kbd>L</kbd>) - Control editor
                  scrolling behavior
                </li>
                <li>Image/Video Upload - Drag & drop or use toolbar buttons</li>
                <li>
                  Code Blocks - Syntax highlighting for multiple languages
                </li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
