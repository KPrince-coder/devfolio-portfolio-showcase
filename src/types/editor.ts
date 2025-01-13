
import { Editor } from '@tiptap/react';

export interface EditorCommands {
  toggleBold: () => void;
  toggleItalic: () => void;
  // ...other commands
}

export interface EditorEvents {
  onUpdate: (content: string) => void;
  onSave?: () => void;
  // ...other events
}

export interface EditorConfig {
  placeholder?: string;
  readOnly?: boolean;
  autoSave?: boolean;
  // ...other config options
}