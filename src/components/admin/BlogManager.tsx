import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "@/types/blog";
import { BlogForm } from "./BlogForm";
import { BlogList } from "./BlogList";
import { checkAuth } from "@/utils/blogUtils";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts-admin'],
    queryFn: async () => {
      console.log("Fetching blog posts...");
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        navigate("/login");
        return [];
      }

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

  const handleSubmit = async (postData: Partial<BlogPost>) => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);
    console.log("Submitting blog post...");

    try {
      const { error } = await supabase
        .from('blogs')
        .insert([{
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          image_url: postData.coverImage,
          published: true,
          author: postData.author,
          tags: postData.tags,
          coverimage: postData.coverImage,
          publishedat: new Date().toISOString(),
        }]);

      if (error) throw error;

      console.log("Blog post created successfully");
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsCreating(false);
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

  const handleUpdate = async (postData: Partial<BlogPost>) => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);
    console.log("Updating blog post...");

    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          image_url: postData.coverImage,
          published: true,
          author: postData.author,
          tags: postData.tags,
          coverimage: postData.coverImage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', isEditing);

      if (error) throw error;

      console.log("Blog post updated successfully");
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsCreating(false);
      setIsEditing(null);
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
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

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

      if (error) throw error;

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
        <BlogForm
          initialData={isEditing ? posts?.find(p => p.id === isEditing) : undefined}
          onSubmit={isEditing ? handleUpdate : handleSubmit}
          onCancel={() => {
            setIsCreating(false);
            setIsEditing(null);
          }}
          loading={loading}
        />
      )}

      <BlogList
        posts={posts || []}
        onEdit={(post) => {
          setIsEditing(post.id);
          setIsCreating(true);
        }}
        onDelete={handleDelete}
      />
    </Card>
  );
};