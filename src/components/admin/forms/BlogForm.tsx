import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Upload,
  FileText,
  Image,
  Save,
  X,
  Tag,
  Code,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  FilePenLine,
} from "lucide-react";
import { handleFileUpload } from "@/utils/blogUtils";
import { BlogPost } from "@/types/blog";
import { RichTextEditor } from "../blog/editor/RichTextEditor";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Editor } from "@tiptap/core";

// Use a stable version of PDF.js worker from cdnjs
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// Add a function to check if worker is available
// Add a function to check worker availability
const checkPDFWorker = async (): Promise<boolean> => {
  try {
    // Try to load a minimal PDF to verify worker
    const minimalPdf = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x0a,
    ]);

    await pdfjsLib.getDocument({ data: minimalPdf }).promise;
    return true;
  } catch (error) {
    console.error("PDF Worker initialization failed:", error);
    return false;
  }
};

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(300, "Excerpt must be less than 300 characters"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  status: z.enum(["draft", "published"]),
  is_featured: z.boolean().default(false),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  author: z.string().optional(),
  canonical_url: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

// Add FileUploadLabel component
const FileUploadLabel = ({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<any>;
}) => (
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

const FileUploadArea = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "relative border-2 border-dashed rounded-lg p-6 min-h-[200px] flex items-center justify-center",
      className
    )}
  >
    {children}
  </div>
);

// Add this new component for displaying file info
const FileInfoCard = ({
  fileInfo,
  onRemove,
}: {
  fileInfo: UploadedFileInfo;
  onRemove: () => void;
}) => (
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
          <p className="font-medium text-sm truncate max-w-[200px]">
            {fileInfo.name}
          </p>
          <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
            <span>{fileInfo.type.split("/")[1].toUpperCase()}</span>
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
  initialData?: Partial<BlogPost>;
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { toast } = useToast();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      tags: initialData?.tags || [],
      status: (initialData?.status as "draft" | "published") || "draft",
      // is_featured: initialData?.is_featured || false,
      // Initialize SEO fields with existing data in edit mode
      meta_title: initialData?.metaTitle || initialData?.title || "",
      meta_description:
        initialData?.metaDescription || initialData?.excerpt || "",
      meta_keywords: initialData?.metaKeywords || "",
      author: initialData?.author || "",
      canonical_url:
        initialData?.canonicalUrl || `blog/${initialData?.slug || ""}`,
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | null
  >(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(
    null
  );

  const [editorRef, setEditorRef] = useState<Editor | null>(null);

  const handleSubmit = async (values: BlogFormValues) => {
    try {
      const postData = {
        ...values,
        id: initialData?.id,
        // Use existing slug from database
        slug: initialData?.slug || values.slug,
        // Generate canonical URL from blog path if not provided
        canonical_url:
          values.canonical_url || `blog/${initialData?.slug || values.slug}`,
        // Ensure SEO fields are properly set
        meta_title: values.meta_title || values.title,
        meta_description: values.meta_description || values.excerpt,
      };

      await onSubmit(postData);
      toast({
        title: "Success",
        description: `Post ${initialData ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} post`,
        variant: "destructive",
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      setUploadProgress(20);
      const reader = new FileReader();

      reader.onloadstart = () => setUploadProgress(40);
      reader.onprogress = () => setUploadProgress(70);

      reader.onload = async (e) => {
        setImagePreviewUrl(e.target?.result as string);
        setUploadProgress(90);

        const url = await handleFileUpload(file);
        if (url) {
          form.setValue("coverImage", url);
          setUploadProgress(100);
          setTimeout(() => {
            setUploadProgress(0);
            setImagePreviewUrl(null);
          }, 1000);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (content: string) => {
    if (editorRef) {
      // Use the editor's commands to set content
      editorRef.commands.setContent(content, false); // false means don't emit update
    }
    form.setValue("content", content);
    setAutoSaveStatus("saving");
    setTimeout(() => {
      setAutoSaveStatus("saved");
    }, 1000);
  };

  const handleAutoSave = useCallback(
    debounce(async () => {
      if (initialData?.id) {
        try {
          const values = form.getValues();
          await onSubmit(values);
          setAutoSaveStatus("saved");
        } catch (error) {
          console.error("Auto-save failed:", error);
          setAutoSaveStatus(null);
        }
      }
    }, 2000),
    [form, initialData?.id, onSubmit]
  );

  useEffect(() => {
    return () => {
      handleAutoSave.cancel();
    };
  }, [handleAutoSave]);

  // Add file import handlers
  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Modify the handleTextImport function to better preserve spacing
  const handleTextImport = async (file: File): Promise<string> => {
    try {
      const content = await readFileAsText(file);
      // Preserve paragraphs and line breaks while avoiding double spacing
      return content
        .split(/\n\n+/) // Split on multiple newlines to identify paragraphs
        .map((paragraph) => {
          // Preserve single line breaks within paragraphs
          const lines = paragraph.split("\n");
          if (lines.length > 1) {
            return lines
              .filter((line) => line.trim()) // Remove empty lines
              .map((line) => `<p>${line}</p>`)
              .join("\n");
          }
          return `<p>${paragraph}</p>`;
        })
        .join("\n\n"); // Add double newline between paragraphs
    } catch (error) {
      console.error("Error reading text file:", error);
      throw new Error("Failed to read text file");
    }
  };

  // Update the handleWordImport function to preserve formatting
  const handleWordImport = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Normal'] => p:fresh",
            "b => strong",
            "i => em",
            "u => u",
            "strike => s",
            "br => br",
          ],
          ignoreEmptyParagraphs: false,
        }
      );

      // Process the HTML to ensure proper spacing
      const processedContent = result.value
        .replace(/<p>\s*<\/p>/g, "<p>&nbsp;</p>") // Preserve empty paragraphs
        .replace(/(<\/h[1-6]>)(?!\n)/g, "$1\n\n") // Add space after headings
        .replace(/(<\/p>)(?!\n)/g, "$1\n") // Add newline after paragraphs
        .trim();

      return processedContent;
    } catch (error) {
      console.error("Error reading Word file:", error);
      throw new Error("Failed to read Word document");
    }
  };

  // Modify the handlePDFImport function to better handle PDF content
  const handlePDFImport = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      let contentHTML = "";

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          // Group text items by vertical position with better spacing detection
          const lines: { [key: string]: { text: string; x: number }[] } = {};
          textContent.items.forEach((item: any) => {
            const y = Math.round(item.transform[5]);
            const x = Math.round(item.transform[4]);
            if (!lines[y]) {
              lines[y] = [];
            }
            lines[y].push({ text: item.str, x });
          });

          // Sort lines by vertical position (top to bottom)
          const sortedPositions = Object.keys(lines)
            .map(Number)
            .sort((a, b) => b - a);

          contentHTML += `<div class="pdf-page">`;
          if (totalPages > 1) {
            contentHTML += `<h3 class="pdf-page-header">Page ${pageNum}</h3>\n\n`;
          }

          let lastY: number | null = null;
          let lastLineWasEmpty = false;

          sortedPositions.forEach((y) => {
            // Sort items within line by x position
            const lineItems = lines[y].sort((a, b) => a.x - b.x);
            const lineText = lineItems
              .map((item) => item.text)
              .join(" ")
              .trim();

            if (!lineText) {
              if (!lastLineWasEmpty) {
                contentHTML += "<p>&nbsp;</p>\n\n";
                lastLineWasEmpty = true;
              }
              return;
            }

            // Detect if new paragraph is needed based on vertical spacing
            const needsNewParagraph = lastY !== null && lastY - y > 20;

            if (needsNewParagraph && !lastLineWasEmpty) {
              contentHTML += "\n";
            }

            contentHTML += `<p>${lineText}</p>\n`;

            lastY = y;
            lastLineWasEmpty = false;
          });

          contentHTML += "</div>\n\n";

          setUploadProgress(Math.floor((pageNum / totalPages) * 90));
        } catch (pageError) {
          console.error(`Error processing page ${pageNum}:`, pageError);
          contentHTML += `<p>Error loading page ${pageNum}</p>\n`;
        }
      }

      return contentHTML;
    } catch (error) {
      console.error("PDF Import Error:", error);
      throw new Error(
        error instanceof Error
          ? `PDF Import Failed: ${error.message}`
          : "Failed to import PDF"
      );
    }
  };

  // Update the handleFileImport function to maintain formatting
  const handleFileImport = async (file: File) => {
    try {
      setUploadProgress(10);
      let content = "";

      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size exceeds 10MB limit");
      }

      switch (file.type) {
        case "text/plain":
          content = await handleTextImport(file);
          setUploadProgress(50);
          break;
        case "application/pdf":
          content = await handlePDFImport(file);
          break;
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          content = await handleWordImport(file);
          setUploadProgress(70);
          break;
        default:
          throw new Error(`Unsupported file type: ${file.type}`);
      }

      if (content) {
        // Clean content while preserving intentional spacing
        content = content
          .replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines to double
          .replace(/<p>\s*<\/p>/g, "<p>&nbsp;</p>") // Preserve empty paragraphs
          .trim();

        // Update editor content
        if (editorRef) {
          editorRef.commands.setContent(content, false);
        }

        form.setValue("content", content);

        setUploadedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          timestamp: new Date(),
        });

        setUploadProgress(100);
        toast({
          title: "Success",
          description: "Content imported successfully",
        });

        setTimeout(() => setUploadProgress(0), 1000);
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to import content",
        variant: "destructive",
      });
      setUploadProgress(0);
    }
  };

  // Add these states for upload animations
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Add drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        await handleFileChange({ target: { files: [file] } } as any);
      } else {
        await handleFileImport(file);
      }
    }
  };

  useEffect(() => {
    if (!initialData) {
      const title = form.getValues("title");
      const excerpt = form.getValues("excerpt");

      // Only update if fields are empty (not manually set)
      if (!form.getValues("meta_title")) {
        form.setValue("meta_title", title);
      }
      if (!form.getValues("meta_description")) {
        form.setValue("meta_description", excerpt);
      }
    }
  }, [form.watch("title"), form.watch("excerpt"), initialData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 p-4 max-w-4xl mx-auto"
      >
        <div className="grid gap-6">
          {/* Title and Author */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter post title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter author name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status and Featured Switch */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Post</FormLabel>
                    <FormDescription>
                      Display this post prominently on your blog
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Excerpt */}
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter post excerpt"
                    className="h-20"
                  />
                </FormControl>
                <FormDescription>
                  A brief summary of your post (max 300 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Editor */}
          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              content={form.getValues("content")}
              onChange={(content) => {
                form.setValue("content", content);
                setAutoSaveStatus("saving");
                setTimeout(() => {
                  setAutoSaveStatus("saved");
                }, 1000);
              }}
              onInit={(editor) => {
                setEditorRef(editor);
              }}
              onSave={handleAutoSave}
              placeholder="Write your post content here..."
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              {autoSaveStatus === "saving" && "Saving..."}
              {autoSaveStatus === "saved" && "All changes saved"}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4 mt-12">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Tags</Label>
              <Badge variant="outline" className="text-xs">
                {form.getValues("tags").length} tags
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-background">
                {form.getValues("tags").map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 h-6"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="w-full"
                />
                <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                  Press Enter to add
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Popular tags:
                <div className="flex flex-wrap gap-2 mt-2">
                  {["tag1", "tag2", "tag3"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() =>
                        !form.getValues("tags").includes(tag) && handleAddTag()
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <FormDescription className="mt-2">
              Add relevant tags to help readers find your post. Tags are
              case-insensitive.
            </FormDescription>
          </div>

          {/* Content Upload Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Import Content from File
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Content</DialogTitle>
                <DialogDescription>
                  Upload content from various file formats
                </DialogDescription>
              </DialogHeader>
              <div
                className={cn(
                  "mt-4 p-6 border-2 border-dashed rounded-lg transition-all duration-200",
                  isDragging
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-muted-foreground/25",
                  "relative overflow-hidden"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileImport(file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center">
                  <FileText className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm font-medium">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports TXT, DOC, DOCX, PDF
                    </p>
                  </motion.div>
                </div>
                {uploadProgress > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <Progress value={uploadProgress} className="h-1" />
                    <p className="text-xs text-center mt-1 text-muted-foreground">
                      Uploading... {uploadProgress}%
                    </p>
                  </motion.div>
                )}
              </div>
              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-4 bg-muted/50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div
              className={cn(
                "relative group rounded-lg overflow-hidden transition-all duration-200",
                isDragging && "ring-2 ring-primary ring-offset-2"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreviewUrl || form.getValues("coverImage") ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative aspect-video"
                >
                  <img
                    src={imagePreviewUrl || form.getValues("coverImage")}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm">
                      Click or drag to change image
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-6"
                  >
                    <Image className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">
                      Click or drag image here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports JPG, PNG, GIF
                    </p>
                  </motion.div>
                </div>
              )}
              {uploadProgress > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 bg-black/50 p-2"
                >
                  <Progress value={uploadProgress} className="h-1" />
                  <p className="text-xs text-center mt-1 text-white">
                    Uploading... {uploadProgress}%
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Enhanced SEO Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">SEO Settings</h3>
              <Badge variant="outline" className="text-xs">
                Search Engine Optimization
              </Badge>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic SEO</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="meta_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="SEO-friendly title"
                                {...field}
                                className="pr-16"
                                maxLength={60}
                              />
                              <span className="absolute right-2 top-2.5 text-xs text-muted-foreground">
                                {field.value?.length || 0}/60
                              </span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Appears in search engine results and browser tabs
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="meta_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Brief description for search engines..."
                                className="resize-none pr-16"
                                maxLength={160}
                                {...field}
                              />
                              <span className="absolute right-2 top-2.5 text-xs text-muted-foreground">
                                {field.value?.length || 0}/160
                              </span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            A compelling description that appears in search
                            results
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced">
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="meta_keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Keywords</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="keyword1, keyword2, keyword3"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Comma-separated keywords (less important for modern
                            SEO)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="URL slug from database"
                              {...field}
                              disabled={!!initialData?.slug} // Disable if we have an existing slug
                            />
                          </FormControl>
                          <FormDescription>
                            The URL slug is automatically generated and cannot
                            be changed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="canonical_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Canonical URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/blog/post-slug"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Leave empty to use blog/[slug] as the canonical URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <Card className="p-4 bg-muted/50">
                        <div className="space-y-1">
                          <p className="text-sm text-blue-600 hover:underline">
                            {form.getValues("meta_title") || "Your Post Title"}
                          </p>
                          <p className="text-sm text-green-700">
                            yourblog.com/{form.getValues("slug") || "post-url"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {form.getValues("meta_description") ||
                              "Your post description will appear here..."}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
