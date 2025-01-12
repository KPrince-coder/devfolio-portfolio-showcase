import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { extensions, defaultEditorConfig } from '@/lib/editor/extensions';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toolbar } from './Toolbar';
import {
  ImageIcon,
  Link2,
  Table,
  Video,
  FileCode,
  Eye,
  Edit,
  Save,
  FileUp,
  FileText,
} from 'lucide-react';
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

  const handleImageInsert = () => {
    if (editor && imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: 'Inserted image' })
        .run();
      setImageUrl('');
    }
  };

  const handleVideoInsert = () => {
    if (editor && videoUrl) {
      editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run();
      setVideoUrl('');
    }
  };

  const handleLinkInsert = () => {
    if (editor && linkUrl) {
      editor
        .chain()
        .focus()
        .setLink({ href: linkUrl, target: '_blank' })
        .run();
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleTableInsert = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  const MediaDialog = ({ type }: { type: 'image' | 'video' | 'link' }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button" // Ensure the button type is "button"
          variant="outline"
          size="sm"
          onClick={(e) => e.preventDefault()} // Prevent default behavior
        >
          {type === 'image' && <ImageIcon className="h-4 w-4" />}
          {type === 'video' && <Video className="h-4 w-4" />}
          {type === 'link' && <Link2 className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert {type}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {type === 'link' && (
            <div className="space-y-2">
              <Label>Text</Label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Link text"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={type === 'image' ? imageUrl : type === 'video' ? videoUrl : linkUrl}
              onChange={(e) => {
                if (type === 'image') setImageUrl(e.target.value);
                else if (type === 'video') setVideoUrl(e.target.value);
                else setLinkUrl(e.target.value);
              }}
              placeholder={`Enter ${type} URL`}
            />
          </div>
          <Button
            type="button" // Ensure the button type is "button"
            onClick={() => {
              if (type === 'image') handleImageInsert();
              else if (type === 'video') handleVideoInsert();
              else handleLinkInsert();
            }}
          >
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="border rounded-lg">
      <div className="border-b p-2 flex items-center justify-between">
        <Toolbar editor={editor} />
        <div className="flex items-center gap-2">
          <MediaDialog type="image" />
          <MediaDialog type="video" />
          <MediaDialog type="link" />
          <Button
            type="button" // Ensure the button type is "button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior
              handleTableInsert();
            }}
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button
            type="button" // Ensure the button type is "button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior
              setIsPreview(!isPreview);
            }}
          >
            {isPreview ? (
              <Edit className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          {onSave && (
            <Button
              type="button" // Ensure the button type is "button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
                onSave();
              }}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {autoSaveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </Button>
          )}
        </div>
      </div>

      <div
        ref={editorRef}
        className={cn(
          'prose prose-lg prose-invert max-w-none min-h-[200px] p-4 focus:outline-none',
          '[&_.text-color]:!text-current [&_.highlight-text]:!bg-current',
          '[&_.imported-content]:space-y-4',
          '[&_.pdf-page]:mb-8 [&_.page-break]:border-t [&_.page-break]:my-6',
          {
            'cursor-text': !readOnly,
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
    </div>
  );
};

export default RichTextEditor;