import { Extension, Node, mergeAttributes, Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Youtube from '@tiptap/extension-youtube';
import lowlight from "highlight.js";

// Custom container for callouts, info boxes, etc.
const CustomContainer = Extension.create({
  name: 'customContainer',

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          return {
            'data-type': attributes.type,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type]',
        getAttrs: element => ({
          type: element.getAttribute('data-type'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: `custom-container ${HTMLAttributes['data-type']}` }), 0];
  },
});

// Custom heading with anchor links
const CustomHeading = Node.create({
  name: 'heading',
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const id = node.textContent.toLowerCase().replace(/\s+/g, '-');
    return [
      `h${level}`,
      mergeAttributes(HTMLAttributes, { id }),
      ['a', { href: `#${id}`, class: 'anchor' }, '🔗'],
      0,
    ];
  },
});

// Code block with line numbers and copy button
const CustomCodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      lineNumbers: {
        default: true,
        parseHTML: element => element.hasAttribute('data-line-numbers'),
        renderHTML: attributes => {
          if (!attributes.lineNumbers) return {};
          return { 'data-line-numbers': '' };
        },
      },
    };
  },
});

// Smart typography rules
const typographyConfig = {
  emDash: '—',
  ellipsis: '…',
  openQuotes: '"',
  closeQuotes: '"',
  rightArrow: '→',
  leftArrow: '←',
  copyright: '©',
  trademark: '™',
  registered: '®',
  notEqual: '≠',
  laquo: '«',
  raquo: '»',
  multiplication: '×',
};

// Table with advanced features
const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isHeaderRow: {
        default: true,
        parseHTML: element => element.hasAttribute('data-header-row'),
        renderHTML: attributes => {
          if (!attributes.isHeaderRow) return {};
          return { 'data-header-row': '' };
        },
      },
    };
  },
});

export const createEditorExtensions = (): Extensions => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6]
    }
  }),
  CustomHeading.configure({
    levels: [1, 2, 3, 4, 5, 6]
  }),
  CustomCodeBlock.configure({
    lowlight,
    defaultLanguage: 'plaintext',
    HTMLAttributes: {
      class: 'code-block-wrapper',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph', 'list'],
    alignments: ['left', 'center', 'right', 'justify'],
  }),
  Typography.configure(typographyConfig),
  Image.configure({
    allowBase64: true,
    HTMLAttributes: {
      class: 'rounded-lg shadow-lg',
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary underline hover:text-primary/80 transition-colors',
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  TextStyle,
  Color,
  CustomTable.configure({
    resizable: true,
    handleWidth: 5,
    cellMinWidth: 100,
  }),
  TableRow,
  TableCell,
  TableHeader,
  Placeholder.configure({
    placeholder: 'Write something amazing...',
    emptyEditorClass: 'is-editor-empty',
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Highlight.configure({
    multicolor: true,
    HTMLAttributes: {
      class: 'highlight-text',
    },
  }),
  Subscript,
  Superscript,
  Youtube.configure({
    width: 840,
    height: 472.5,
    HTMLAttributes: {
      class: 'rounded-lg overflow-hidden',
    },
  }),
  CustomContainer,
  
  // Add custom paragraph handling
  Node.create({
    name: 'customParagraph',
    priority: 1000,
    addOptions() {
      return {
        HTMLAttributes: {
          class: 'imported-paragraph',
        },
      };
    },
    parseHTML() {
      return [
        { tag: 'p' },
        { tag: 'div.imported-content p' },
        { tag: 'div.pdf-page span' },
      ];
    },
  }),

  // Add page break handling for PDFs
  Node.create({
    name: 'pageBreak',
    group: 'block',
    parseHTML() {
      return [{ tag: 'hr.page-break' }];
    },
    renderHTML() {
      return ['hr', { class: 'page-break' }];
    },
  }),
];

export interface EditorConfigType {
  autofocus: 'end' | 'start' | boolean;
  enablePasteRules: boolean;
  enableInputRules: boolean;
}

// Export everything as a named export
export const extensions = createEditorExtensions();
export const defaultEditorConfig: EditorConfigType = {
  autofocus: 'end',
  enablePasteRules: true,
  enableInputRules: true,
};

// Custom extension configurations
export const editorConfig = {
  autofocus: 'end',
  enablePasteRules: true,
  enableInputRules: true,
};

// Extension helper functions
export const getExtensionField = (fieldName: string, extensions: any[]) => {
  return extensions.find(ext => ext.name === fieldName);
};

export const isExtensionEnabled = (extensionName: string, extensions: any[]) => {
  return extensions.some(ext => ext.name === extensionName);
};

// Add extension event handlers
export const editorEvents = {
  onUpdate: ({ editor }) => {
    const content = editor.getHTML();
    // Handle content update
    return content;
  },
  onCreate: ({ editor }) => {
    // Handle editor creation
  },
  onSelectionUpdate: ({ editor }) => {
    // Handle selection changes
  },
  // Add more event handlers as needed
};

// Add CSS utility for code blocks
export const codeBlockStyles = {
  'code-block-wrapper': 'relative rounded-md bg-muted p-4 my-4',
  'data-line-numbers': 'pl-12 [&_pre]:before:content-[attr(data-line-number)] [&_pre]:before:absolute [&_pre]:before:left-0 [&_pre]:before:w-8 [&_pre]:before:text-right [&_pre]:before:text-muted-foreground/60 [&_pre]:before:mr-4',
};
