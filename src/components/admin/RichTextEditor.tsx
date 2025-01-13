import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { extensions, defaultEditorConfig } from '@/lib/editor/extensions';
import debounce from 'lodash/debounce';

import { Toolbar } from './Toolbar';

import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  autoSave?: boolean;
  className?: string;
}

export const RichTextEditor = ({
  content,
  onChange,
  onSave,
  placeholder = 'Enter post content or upload from file',
  readOnly,
  autoSave,
  className,
}: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions,
    content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-lg prose-invert max-w-none min-h-[200px] p-4 focus:outline-none',
          className
        ),
      },
      handlePaste: (view, event) => {
        if (event.clipboardData?.files?.length) {
          return true; // Let the file upload handle it
        }
        return false; // Allow normal paste behavior
      },
      handleDrop: (view, event, slice, moved) => {
        if (event.dataTransfer?.files?.length) {
          return true; // Let the file upload handle it
        }
        return false; // Allow normal drop behavior
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      if (autoSave) {
        debouncedAutoSave(html);
      }
    },
    ...defaultEditorConfig,
  });

  const debouncedAutoSave = useCallback(
    debounce((html: string) => {
      setAutoSaveStatus('saving');
      setTimeout(() => {
        onSave?.();
        setAutoSaveStatus('saved');
      }, 1000);
    }, 1000),
    [onSave]
  );

  // Auto-focus the editor when clicking inside the content area
  useEffect(() => {
    const handleClick = () => {
      if (editor && !readOnly) {
        editor.commands.focus();
      }
    };

    const editorElement = editorRef.current;
    if (editorElement) {
      editorElement.addEventListener('click', handleClick);
    }
    return () => {
      if (editorElement) {
        editorElement.removeEventListener('click', handleClick);
      }
    };
  }, [editor, readOnly]);

  // Add this useEffect after the editor initialization
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Create media handlers
  const mediaHandlers = {
    handleImageInsert: (url: string) => {
      if (editor) {
        editor
          .chain()
          .focus()
          .setImage({ src: url, alt: 'Inserted image' })
          .run();
      }
    },
    handleVideoInsert: (url: string) => {
      if (editor) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
    },
    handleLinkInsert: (url: string, text?: string) => {
      if (editor) {
        if (text) {
          editor.chain().focus().insertContent(text).run();
        }
        editor
          .chain()
          .focus()
          .setLink({ href: url, target: '_blank' })
          .run();
      }
    },
    handleTableInsert: () => {
      if (editor) {
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      }
    },
  };

  return (
    <div className="border rounded-lg">
      <div className="border-b p-2">
        <Toolbar 
          editor={editor}
          onPreviewToggle={() => setIsPreview(!isPreview)}
          isPreview={isPreview}
          onSave={onSave}
          isSaving={autoSaveStatus === 'saving'}
          mediaHandlers={mediaHandlers}
        />
      </div>
      
      <div
        ref={editorRef}
        className={cn(
          'prose prose-lg prose-invert max-w-none min-h-[200px] p-4 focus:outline-none',
          '[&_.text-color]:!text-current [&_.highlight-text]:!bg-current',
          '[&_.imported-content]:space-y-4',
          '[&_.pdf-page]:mb-8 [&_.page-break]:border-t [&_.page-break]:my-6',
          // Add code block styles
          '[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto',
          '[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm',
          '[&_.code-block-wrapper]:relative [&_.code-block-wrapper]:my-4',
          '[&_.hljs]:bg-transparent',
          {
            'cursor-text': !readOnly,
            'hidden': isPreview,
          },
          className
        )}
      >
        <EditorContent editor={editor} />
        {!editor?.getText() && (
          <div
            className="absolute top-4 left-4 text-muted-foreground pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {placeholder}
          </div>
        )}
      </div>

      {isPreview && (
        <div className="prose prose-lg prose-invert max-w-none min-h-[200px] p-4">
          <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;