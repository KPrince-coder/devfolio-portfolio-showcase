import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Upload, FileText, Image, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const BlogManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    image_url: "",
    published: false,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check authentication status
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to manage blog posts",
      });
      navigate("/login");
      return false;
    }
    return true;
  };

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
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
      return data as BlogPost[];
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
          published: newPost.published,
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
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
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
            {newPost.image_url && (
              <img
                src={newPost.image_url}
                alt="Cover"
                className="mt-2 max-h-40 object-cover rounded"
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Creating..." : "Create Post"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreating(false)}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">{post.title}</h3>
              <span className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="mt-2 max-h-40 object-cover rounded"
              />
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};