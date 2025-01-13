import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileText, Image, Save, X, Tag, Code, Bold, Italic, Underline, Strikethrough, FilePenLine } from "lucide-react";
import { handleFileUpload } from "@/utils/blogUtils";
import { BlogPost } from "@/types/blog";
import { RichTextEditor } from "./RichTextEditor";
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import { debounce } from 'lodash';
import { motion } from "framer-motion";
import {cn} from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

// Add FileUploadLabel component
const FileUploadLabel = ({ children, icon: Icon }: { children: React.ReactNode; icon: React.ComponentType<any> }) => (
  <Label className="flex items-center gap-2">
    <Icon className="h-4 w-4" />
    {children}
  </Label>
);

// Add new interface for file info
interface UploadedFileInfo {
  name: string;
  type: string;
  size: number;
  timestamp: Date;
}

const FileUploadArea = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative border-2 border-dashed rounded-lg p-6 min-h-[200px] flex items-center justify-center", className)}>
    {children}
  </div>
);

// Add this new component for displaying file info
const FileInfoCard = ({ fileInfo, onRemove }: { fileInfo: UploadedFileInfo; onRemove: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-4 bg-muted/50 rounded-lg p-4 border border-dashed relative group"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FilePenLine className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm truncate max-w-[200px]">{fileInfo.name}</p>
          <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
            <span>{fileInfo.type.split('/')[1].toUpperCase()}</span>
            <span>•</span>
            <span>{(fileInfo.size / 1024).toFixed(1)} KB</span>
            <span>•</span>
            <span>{fileInfo.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
    <div className="w-full bg-primary/10 h-1 rounded-full mt-3">
      <div className="bg-primary h-full w-full rounded-full" />
    </div>
  </motion.div>
);

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}
export const BlogForm = ({ initialData, onSubmit, onCancel, loading }: BlogFormProps) => {
  const { toast } = useToast();
  const [post, setPost] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    author: initialData?.author || "",
    tags: initialData?.tags || [],
    coverImage: initialData?.coverImage || "",
    content: initialData?.content || "",
  });
  const [tagInput, setTagInput] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const url = await handleFileUpload(file);
      if (url) {
        setPost(prev => ({
          ...prev,
          coverImage: url,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(post);
  };

  const handleContentChange = (content: string) => {
    setPost(prev => ({
      ...prev,
      content,
    }));
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);
  };

  const handleAutoSave = useCallback(
    debounce(async () => {
      if (initialData?.id) {
        try {
          await onSubmit(post);
          setAutoSaveStatus('saved');
        } catch (error) {
          console.error('Auto-save failed:', error);
          setAutoSaveStatus(null);
        }
      }
    }, 2000),
    [post, initialData?.id, onSubmit]
  );

  // Add cleanup for auto-save
  useEffect(() => {
    return () => {
      handleAutoSave.cancel();
    };
  }, [handleAutoSave]);

  // Update the file handling in your import content section:
  const handleFileImport = async (file: File) => {
    try {
      let content = '';
      
      if (file.type === 'text/plain') {
        content = await handleTextImport(file);
      } else if (file.type === 'application/msword' || 
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        content = await handleWordImport(file);
      } else if (file.type === 'application/pdf') {
        content = await handlePDFImport(file);
      }

      if (content) {
        handleContentChange(content);
        setUploadedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          timestamp: new Date(),
        });
        toast({ description: 'Content imported successfully' });
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({ variant: "destructive", description: 'Failed to import content' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="Enter post title"
          required
          className="w-full"
        />
      </div>

      {/* Author */}
      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={post.author}
          onChange={(e) => setPost({ ...post, author: e.target.value })}
          placeholder="Enter author name"
          required
          className="w-full"
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input
          id="excerpt"
          value={post.excerpt}
          onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
          placeholder="Enter post excerpt"
          required
          className="w-full"
        />
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">Content</Label>
        <RichTextEditor
          content={post.content}
          onChange={handleContentChange}
          onSave={handleAutoSave}
          autoSave={Boolean(initialData?.id)}
          placeholder="Enter post content or upload from file"
        />
        <div className="flex justify-end text-xs text-muted-foreground">
          {autoSaveStatus === 'saving' && "Saving..."}
          {autoSaveStatus === 'saved' && "All changes saved"}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            <Tag className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Import Content - Updated */}
      <div className="space-y-2">
        <FileUploadLabel icon={FileText}>
          Import Content
        </FileUploadLabel>
        <FileUploadArea>
          <Input
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileImport(file);
            }}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {uploadedFile ? (
            <FileInfoCard
              fileInfo={uploadedFile}
              onRemove={() => setUploadedFile(null)}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <FileText className="mx-auto h-8 w-8 mb-2" />
              <p>Drop your file here or click to browse</p>
              <p className="text-xs mt-1">Supports TXT, DOC, DOCX, PDF</p>
            </div>
          )}
        </FileUploadArea>
      </div>

      {/* Cover Image - Updated */}
      <div className="space-y-2">
        <FileUploadLabel icon={Image}>
          Cover Image
        </FileUploadLabel>
        <FileUploadArea className={cn(post.coverImage && "border-primary bg-primary/5")}>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt="Cover"
              className="max-h-40 w-full object-cover rounded"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <Image className="mx-auto h-8 w-8 mb-2" />
              <p>Drop an image here or click to browse</p>
              <p className="text-xs mt-1">Supports JPG, PNG, GIF</p>
            </div>
          )}
        </FileUploadArea>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-4 justify-end">
        <Button type="submit" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
            ? "Update Post"
            : "Create Post"}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        
      </div>
    </form>
  );
};

// Add helper functions for content import
const handleTextImport = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      const content = `<div class="imported-content">${
        (text as string).split('\n')
          .map(line => line.trim() ? `<p>${line}</p>` : '<br/>')
          .join('')
      }</div>`;
      resolve(content);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const handleWordImport = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const content = `<div class="imported-content">${result.value}</div>`;
        resolve(content);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const handlePDFImport = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const pdf = await pdfjs.getDocument(reader.result as ArrayBuffer).promise;
        const numPages = pdf.numPages;
        const text = [];
        
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.reduce((acc: string, item: any) => {
            const fontSize = Math.round(item.transform[3]);
            return acc + `<span style="font-size: ${fontSize}px;">${item.str}</span>`;
          }, '');
          text.push(`<div class="pdf-page">${pageText}</div>`);
        }
        
        const content = `<div class="imported-content">${text.join('<hr class="page-break" />')}</div>`;
        resolve(content);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export default BlogForm;