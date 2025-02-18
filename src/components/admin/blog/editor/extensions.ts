import { Extension, Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import { Markdown } from "tiptap-markdown";
import Focus from "@tiptap/extension-focus";
import lowlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import { mergeAttributes } from "@tiptap/core";
// import Container from "@/components/admin/blog/editor/extensions/Container";

// Register languages for syntax highlighting
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("javascript", javascript);
lowlight.registerLanguage("typescript", typescript);
lowlight.registerLanguage("python", python);

// Custom container for callouts, info boxes, etc.
const CustomContainer = Extension.create({
  name: "container",
  addAttributes() {
    return {
      type: {
        default: "info",
        rendered: true,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-type=container]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "container",
        class: `container container-${HTMLAttributes.type}`,
      }),
      0,
    ];
  },
});

// Custom code block with syntax highlighting
const CustomCodeBlock = CodeBlockLowlight.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;
        const node = $from.node();

        // Only handle tab in code blocks
        if (node.type.name !== this.name) {
          return false;
        }

        // Insert 2 spaces for tab
        editor.commands.insertContent("  ");
        return true;
      },
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: "plain",
        parseHTML: (element) => element.getAttribute("data-language"),
        renderHTML: (attributes) => ({
          "data-language": attributes.language,
          class: `language-${attributes.language}`,
        }),
      },
    };
  },
}).configure({
  lowlight,
  defaultLanguage: "plain",
  HTMLAttributes: {
    class: "code-block-wrapper not-prose",
  },
});

// Custom Heading with ID attributes for better SEO
const CustomHeading = Node.create({
  name: "heading",
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const id = node.textContent
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return [
      `h${level}`,
      mergeAttributes(HTMLAttributes, { id, class: `heading-${level}` }),
      0,
    ];
  },
});

// Configure table extension
const CustomTable = Table.configure({
  resizable: true,
  HTMLAttributes: {
    class: "tableWrapper",
  },
});

const CustomTableRow = TableRow.configure();
const CustomTableHeader = TableHeader.configure();
const CustomTableCell = TableCell.configure();

// Export all extensions
export const extensions = [
  StarterKit.configure({
    codeBlock: false,
    heading: false,
  }),
  CustomHeading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  CustomCodeBlock.configure({
    HTMLAttributes: {
      class: "code-block-wrapper not-prose",
    },
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Typography,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-primary-teal hover:text-primary-teal/80 underline",
      rel: "noopener noreferrer",
      target: "_blank",
    },
    validate: (href) => /^https?:\/\//.test(href),
  }),
  Image.configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg max-w-full",
      loading: "lazy",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "What's the title?";
      }
      return "Start writing or press '/' for commands...";
    },
    includeChildren: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose pl-2",
    },
  }),
  TaskItem.configure({
    nested: true,
  }),
  CustomTable,
  CustomTableRow,
  CustomTableHeader,
  CustomTableCell,
  Youtube.configure({
    width: 840,
    height: 472.5,
    HTMLAttributes: {
      class: "rounded-lg w-full aspect-video",
    },
    inline: false,
  }),
  Color.configure({
    types: ["textStyle"],
  }),
  TextStyle,
  Subscript,
  Superscript,
  FontFamily.configure({
    types: ["textStyle"],
  }),
  Markdown.configure({
    html: true,
    transformCopiedText: true,
    transformPastedText: true,
  }),
  Focus.configure({
    className: "has-focus",
    mode: "all",
  }),
  CustomContainer.configure({
    types: ["info", "warning", "success", "error"],
  }),
];

export interface EditorConfigType {
  autofocus: "end" | "start" | boolean;
  enablePasteRules: boolean;
  enableInputRules: boolean;
}

export const defaultEditorConfig: EditorConfigType = {
  autofocus: "end",
  enablePasteRules: true,
  enableInputRules: true,
};

export const editorConfig = {
  autofocus: "end",
  enablePasteRules: true,
  enableInputRules: true,
};

export const getExtensionField = (fieldName: string, extensions: any[]) => {
  return extensions.find((ext) => ext.name === fieldName);
};

export const isExtensionEnabled = (
  extensionName: string,
  extensions: any[]
) => {
  return extensions.some((ext) => ext.name === extensionName);
};

export const editorEvents = {
  onUpdate: ({ editor }) => {
    const content = editor.getHTML();
    // Handle content update
  },
  onFocus: ({ editor }) => {
    // Handle focus
  },
  onBlur: ({ editor }) => {
    // Handle blur
  },
  onSelectionUpdate: ({ editor }) => {
    // Handle selection changes
  },
};

export const codeBlockStyles = {
  "code-block-wrapper": "relative rounded-md bg-muted p-4 my-4",
  "data-line-numbers":
    "pl-12 [&_pre]:before:content-[attr(data-line-number)] [&_pre]:before:absolute [&_pre]:before:left-0 [&_pre]:before:w-8 [&_pre]:before:text-right [&_pre]:before:text-muted-foreground/60 [&_pre]:before:mr-4",
};
