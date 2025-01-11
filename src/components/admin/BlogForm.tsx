// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Plus, Upload, FileText, Image, Save, X, Tag } from "lucide-react";
// import { handleFileUpload } from "@/utils/blogUtils";
// import { BlogPost } from "@/types/blog";

// interface BlogFormProps {
//   initialData?: BlogPost;
//   onSubmit: (data: Partial<BlogPost>) => Promise<void>;
//   onCancel: () => void;
//   loading: boolean;
// }

// export const BlogForm = ({ initialData, onSubmit, onCancel, loading }: BlogFormProps) => {
//   const [post, setPost] = useState({
//     title: initialData?.title || "",
//     content: initialData?.content || "",
//     excerpt: initialData?.excerpt || "",
//     image_url: initialData?.coverImage || "",
//     author: initialData?.author || "",
//     tags: initialData?.tags || [],
//     coverImage: initialData?.coverImage || "",
//   });
//   const [tagInput, setTagInput] = useState("");

//   const handleAddTag = () => {
//     if (tagInput.trim()) {
//       setPost(prev => ({
//         ...prev,
//         tags: [...prev.tags, tagInput.trim()]
//       }));
//       setTagInput("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setPost(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (file.type === 'text/plain' || file.type === 'application/pdf' || 
//         file.type.includes('word') || file.type.includes('officedocument')) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const text = e.target?.result;
//         setPost(prev => ({
//           ...prev,
//           content: text as string
//         }));
//       };
//       reader.readAsText(file);
//     } else if (file.type.startsWith('image/')) {
//       const url = await handleFileUpload(file);
//       if (url) {
//         setPost(prev => ({
//           ...prev,
//           coverImage: url,
//           image_url: url
//         }));
//       }
//     }
//   };

//   return (
//     <form onSubmit={(e) => {
//       e.preventDefault();
//       onSubmit(post);
//     }} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="title">Title</Label>
//         <Input
//           id="title"
//           value={post.title}
//           onChange={(e) => setPost({ ...post, title: e.target.value })}
//           placeholder="Enter post title"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="author">Author</Label>
//         <Input
//           id="author"
//           value={post.author}
//           onChange={(e) => setPost({ ...post, author: e.target.value })}
//           placeholder="Enter author name"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="excerpt">Excerpt</Label>
//         <Textarea
//           id="excerpt"
//           value={post.excerpt}
//           onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
//           placeholder="Enter post excerpt"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="content">Content</Label>
//         <Textarea
//           id="content"
//           value={post.content}
//           onChange={(e) => setPost({ ...post, content: e.target.value })}
//           placeholder="Enter post content or import from file"
//           className="min-h-[200px]"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="flex items-center gap-2">Tags</Label>
//         <div className="flex gap-2">
//           <Input
//             value={tagInput}
//             onChange={(e) => setTagInput(e.target.value)}
//             placeholder="Add a tag"
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 e.preventDefault();
//                 handleAddTag();
//               }
//             }}
//           />
//           <Button type="button" onClick={handleAddTag}>
//             <Tag className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {post.tags.map((tag) => (
//             <span
//               key={tag}
//               className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
//             >
//               {tag}
//               <button
//                 type="button"
//                 onClick={() => handleRemoveTag(tag)}
//                 className="ml-1 text-muted-foreground hover:text-foreground"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label className="flex items-center gap-2">
//           <FileText className="h-4 w-4" />
//           Import Content
//         </Label>
//         <Input
//           type="file"
//           accept=".txt,.doc,.docx,.pdf"
//           onChange={handleFileChange}
//           disabled={loading}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="flex items-center gap-2">
//           <Image className="h-4 w-4" />
//           Cover Image
//         </Label>
//         <Input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           disabled={loading}
//         />
//         {post.coverImage && (
//           <img
//             src={post.coverImage}
//             alt="Cover"
//             className="mt-2 max-h-40 object-cover rounded"
//           />
//         )}
//       </div>

//       <div className="flex items-center gap-4">
//         <Button type="submit" disabled={loading}>
//           <Save className="mr-2 h-4 w-4" />
//           {loading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Post" : "Create Post")}
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onCancel}
//           disabled={loading}
//         >
//           <X className="mr-2 h-4 w-4" />
//           Cancel
//         </Button>
//       </div>
//     </form>
//   );
// };







// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Plus, Upload, FileText, Image, Save, X, Tag, Code } from "lucide-react";
// import { handleFileUpload } from "@/utils/blogUtils";
// import { BlogPost } from "@/types/blog";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import  lowlight  from "highlight.js";
// import css from "highlight.js/lib/languages/css";
// import js from "highlight.js/lib/languages/javascript";
// import ts from "highlight.js/lib/languages/typescript";
// import html from "highlight.js/lib/languages/xml";
// import  Toolbar  from "../Toolbar"; // Custom toolbar component for formatting options

// // Register syntax highlighting languages
// lowlight.registerLanguage("html", html);
// lowlight.registerLanguage("css", css);
// lowlight.registerLanguage("js", js);
// lowlight.registerLanguage("ts", ts);

// interface BlogFormProps {
//   initialData?: BlogPost;
//   onSubmit: (data: Partial<BlogPost>) => Promise<void>;
//   onCancel: () => void;
//   loading: boolean;
// }

// export const BlogForm = ({ initialData, onSubmit, onCancel, loading }: BlogFormProps) => {
//   const [post, setPost] = useState({
//     title: initialData?.title || "",
//     excerpt: initialData?.excerpt || "",
//     author: initialData?.author || "",
//     tags: initialData?.tags || [],
//     coverImage: initialData?.coverImage || "",
//   });
//   const [tagInput, setTagInput] = useState("");

//   // Initialize Tiptap editor
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         codeBlock: false, // Disable default code block to use custom one
//       }),
//       CodeBlockLowlight.configure({
//         lowlight,
//       }),
//     ],
//     content: initialData?.content || "",
//   });

//   const handleAddTag = () => {
//     if (tagInput.trim()) {
//       setPost(prev => ({
//         ...prev,
//         tags: [...prev.tags, tagInput.trim()]
//       }));
//       setTagInput("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setPost(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (file.type === 'text/plain' || file.type === 'application/pdf' || 
//         file.type.includes('word') || file.type.includes('officedocument')) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const text = e.target?.result;
//         editor?.commands.setContent(text as string);
//       };
//       reader.readAsText(file);
//     } else if (file.type.startsWith('image/')) {
//       const url = await handleFileUpload(file);
//       if (url) {
//         setPost(prev => ({
//           ...prev,
//           coverImage: url,
//         }));
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const content = editor?.getHTML() || "";
//     await onSubmit({
//       ...post,
//       content,
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="title">Title</Label>
//         <Input
//           id="title"
//           value={post.title}
//           onChange={(e) => setPost({ ...post, title: e.target.value })}
//           placeholder="Enter post title"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="author">Author</Label>
//         <Input
//           id="author"
//           value={post.author}
//           onChange={(e) => setPost({ ...post, author: e.target.value })}
//           placeholder="Enter author name"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="excerpt">Excerpt</Label>
//         <Input
//           id="excerpt"
//           value={post.excerpt}
//           onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
//           placeholder="Enter post excerpt"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="flex items-center gap-2">Content</Label>
//         <Toolbar editor={editor} />
//         <EditorContent editor={editor} className="min-h-[200px] p-4 border rounded-lg" />
//       </div>

//       <div className="space-y-2">
//         <Label className="flex items-center gap-2">Tags</Label>
//         <div className="flex gap-2">
//           <Input
//             value={tagInput}
//             onChange={(e) => setTagInput(e.target.value)}
//             placeholder="Add a tag"
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 e.preventDefault();
//                 handleAddTag();
//               }
//             }}
//           />
//           <Button type="button" onClick={handleAddTag}>
//             <Tag className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {post.tags.map((tag) => (
//             <span
//               key={tag}
//               className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
//             >
//               {tag}
//               <button
//                 type="button"
//                 onClick={() => handleRemoveTag(tag)}
//                 className="ml-1 text-muted-foreground hover:text-foreground"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label className="flex items-center gap-2">
//           <FileText className="h-4 w-4" />
//           Import Content
//         </Label>
//         <Input
//           type="file"
//           accept=".txt,.doc,.docx,.pdf"
//           onChange={handleFileChange}
//           disabled={loading}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="flex items-center gap-2">
//           <Image className="h-4 w-4" />
//           Cover Image
//         </Label>
//         <Input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           disabled={loading}
//         />
//         {post.coverImage && (
//           <img
//             src={post.coverImage}
//             alt="Cover"
//             className="mt-2 max-h-40 object-cover rounded"
//           />
//         )}
//       </div>

//       <div className="flex items-center gap-4">
//         <Button type="submit" disabled={loading}>
//           <Save className="mr-2 h-4 w-4" />
//           {loading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Post" : "Create Post")}
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onCancel}
//           disabled={loading}
//         >
//           <X className="mr-2 h-4 w-4" />
//           Cancel
//         </Button>
//       </div>
//     </form>
//   );
// };


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileText, Image, Save, X, Tag, Code, Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { handleFileUpload } from "@/utils/blogUtils";
import { BlogPost } from "@/types/blog";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import lowlight from "highlight.js";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import Toolbar from "../Toolbar"; // Custom toolbar component for formatting options

// Register syntax highlighting languages
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const BlogForm = ({ initialData, onSubmit, onCancel, loading }: BlogFormProps) => {
  const [post, setPost] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    author: initialData?.author || "",
    tags: initialData?.tags || [],
    coverImage: initialData?.coverImage || "",
  });
  const [tagInput, setTagInput] = useState("");

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use custom one
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: initialData?.content || "",
  });

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

    if (file.type === 'text/plain' || file.type === 'application/pdf' || 
        file.type.includes('word') || file.type.includes('officedocument')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        editor?.commands.setContent(text as string);
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/')) {
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
    const content = editor?.getHTML() || "";
    await onSubmit({
      ...post,
      content,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={post.author}
          onChange={(e) => setPost({ ...post, author: e.target.value })}
          placeholder="Enter author name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input
          id="excerpt"
          value={post.excerpt}
          onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
          placeholder="Enter post excerpt"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">Content</Label>
        <Toolbar editor={editor} />
        <EditorContent editor={editor} className="min-h-[200px] p-4 border rounded-lg" />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button type="button" onClick={handleAddTag}>
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

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Import Content
        </Label>
        <Input
          type="file"
          accept=".txt,.doc,.docx,.pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Cover Image
        </Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt="Cover"
            className="mt-2 max-h-40 object-cover rounded"
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Post" : "Create Post")}
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