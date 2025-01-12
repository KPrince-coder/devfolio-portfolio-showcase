// components/BlogArchive.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Tag, User, Share, LayoutGrid, List } from "lucide-react";
import { useState, useMemo } from "react";
import { BlogPost, BlogPostResponse } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {slugify} from "@/utils/slugify";

export const BlogArchive = () => {
  const navigate = useNavigate();
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts-archive'],
    queryFn: async () => {
      console.log("Fetching blog posts...");
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('publishedat', { ascending: false })
        .returns<BlogPostResponse[]>();

      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }

      console.log("Blog posts fetched:", data);
      
      return data.map((post): BlogPost => ({
        id: post.id,
        slug: post.slug || slugify(post.title),
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content,
        coverImage: post.coverimage || post.image_url || "",
        author: post.author || "Anonymous",
        publishedAt: post.publishedat || post.created_at,
        tags: post.tags || []
      }));
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "title">("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique tags from all posts
  const allTags = useMemo(() => {
    if (!blogPosts) return [];
    const tags = new Set<string>();
    blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return ["all", ...Array.from(tags)];
  }, [blogPosts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    if (!blogPosts) return [];
    return blogPosts
      .filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "latest":
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
          case "oldest":
            return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [blogPosts, searchQuery, selectedTag, sortBy]);

  const handleShare = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug || slugify(post.title)}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <section id="blog-archive" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading blog posts...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog-archive" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header and Controls */}
        <div className="mb-12 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Blog Archive</h2>
            <p className="text-muted-foreground">Explore our collection of articles</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">By Title</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                size="icon"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="icon"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </motion.div>
        </div>

        {/* Posts Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === "grid"
                ? "grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-8"
            }
          >
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                viewMode={viewMode}
                onShare={() => handleShare(post)}
                onClick={() => navigate(`/blog/${post.id}`)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );

  // Update BlogCard props interface
  interface BlogCardProps {
    post: BlogPost;
    viewMode: "grid" | "list";
    onShare: () => void;
    onClick: () => void;
  }

  const BlogCard: React.FC<BlogCardProps> = ({ post, viewMode, onShare, onClick }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={viewMode === "grid" ? "" : "max-w-3xl mx-auto"}
      >
        <Card
          className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl ${
            viewMode === "list" ? "flex" : ""
          }`}
          onClick={() => navigate(`/blog/${encodeURIComponent(post.slug || slugify(post.title))}`)}
        >
          <div className={`
            aspect-video overflow-hidden
            ${viewMode === "list" ? "w-1/3" : ""}
          `}>
            <img
              src={post.coverImage || "https://images.unsplash.com/photo-1587620962725-abab7fe55159"}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          <div className={`
            flex flex-col justify-between
            ${viewMode === "list" ? "w-2/3 p-6" : "p-6"}
          `}>
            <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
              {post.title}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  };
};

export default BlogArchive;