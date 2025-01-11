import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Upload, FileText, Image, Save, X, Tag, Edit, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "@/types/blog";

interface SupabaseBlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  published: boolean | null;
  created_at: string;
  updated_at: string;
  author: string | null;
  tags: string[] | null;
  publishedat: string | null;
  coverimage: string | null;
}

export const BlogManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: "",
    published: false,
    author: "",
    tags: [] as string[],
    coverImage: "",
  });
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const checkAuth = async () => {
    console.log("Checking authentication status...");
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session check error:", sessionError);
      return false;
    }
    
    if (!session) {
      console.log("No active session found");
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to manage blog posts",
      });
      navigate("/login");
      return false;
    }

    console.log("Checking admin status for user:", session.user.id);
    
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle();
    
    if (adminError) {
      console.error("Admin check error:", adminError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify admin status",
      });
      navigate("/login");
      return false;
    }

    if (!adminData) {
      console.log("User is not an admin:", session.user.id);
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You must be an admin to manage blog posts",
      });
      navigate("/login");
      return false;
    }
    
    console.log("Authentication check passed - user is admin");
    return true;
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts-admin'],
    queryFn: async () => {
      console.log("Fetching blog posts...");
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return [];

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }
      
      console.log("Blog posts fetched successfully:", data);
      
      return (data as SupabaseBlogPost[]).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        coverImage: post.coverimage || post.image_url || "",
        author: post.author || "",
        publishedAt: post.publishedat || post.created_at,
        tags: post.tags || []
      }));
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    if (file.type === 'text/plain' || file.type === 'application/pdf' || 
        file.type.includes('word') || file.type.includes('officedocument')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        setNewPost(prev => ({
          ...prev,
          content: text as string
        }));
        toast({
          title: "File imported",
          description: "Content has been imported successfully",
        });
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/')) {
      setLoading(true);
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `blog_${crypto.randomUUID()}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("profile")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("profile")
          .getPublicUrl(filePath);

        setNewPost(prev => ({
          ...prev,
          coverImage: publicUrl.publicUrl,
          image_url: publicUrl.publicUrl
        }));

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload image",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    setLoading(true);
    console.log("Submitting blog post...");

    try {
      const { error } = await supabase
        .from('blogs')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          excerpt: newPost.excerpt,
          image_url: newPost.image_url,
          published: true,
          author: newPost.author,
          tags: newPost.tags,
          coverimage: newPost.coverImage,
          publishedat: new Date().toISOString(),
        }]);

      if (error) {
        console.error("Error creating blog post:", error);
        throw error;
      }

      console.log("Blog post created successfully");
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsCreating(false);
      setNewPost({
        title: "",
        content: "",
        excerpt: "",
        image_url: "",
        published: false,
        author: "",
        tags: [],
        coverImage: "",
      });

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog post",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (post: BlogPost) => {
    setIsEditing(post.id);
    setNewPost({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      image_url: post.coverImage,
      published: true,
      author: post.author,
      tags: post.tags,
      coverImage: post.coverImage,
    });
    setIsCreating(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    setLoading(true);
    console.log("Updating blog post...");

    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: newPost.title,
          content: newPost.content,
          excerpt: newPost.excerpt,
          image_url: newPost.image_url,
          published: true,
          author: newPost.author,
          tags: newPost.tags,
          coverimage: newPost.coverImage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', isEditing);

      if (error) {
        console.error("Error updating blog post:", error);
        throw error;
      }

      console.log("Blog post updated successfully");
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsCreating(false);
      setIsEditing(null);
      setNewPost({
        title: "",
        content: "",
        excerpt: "",
        image_url: "",
        published: false,
        author: "",
        tags: [],
        coverImage: "",
      });

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog post",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    setLoading(true);
    console.log("Deleting blog post...");

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error("Error deleting blog post:", error);
        throw error;
      }

      console.log("Blog post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog post",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-40">
          Loading...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Blog Posts</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="mb-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={newPost.author}
              onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={newPost.excerpt}
              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
              placeholder="Enter post excerpt"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Enter post content or import from file"
              className="min-h-[200px]"
              required
            />
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
              {newPost.tags.map((tag) => (
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
              onChange={handleFileUpload}
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
              onChange={handleFileUpload}
              disabled={loading}
            />
            {newPost.coverImage && (
              <img
                src={newPost.coverImage}
                alt="Cover"
                className="mt-2 max-h-40 object-cover rounded"
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Post" : "Create Post")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setIsEditing(null);
                setNewPost({
                  title: "",
                  content: "",
                  excerpt: "",
                  image_url: "",
                  published: false,
                  author: "",
                  tags: [],
                  coverImage: "",
                });
              }}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {posts?.map((post: BlogPost) => (
          <Card key={post.id} className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">{post.title}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(post)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="mt-2 max-h-40 object-cover rounded"
              />
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};