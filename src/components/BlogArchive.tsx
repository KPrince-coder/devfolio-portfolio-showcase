// components/BlogArchive.tsx
import { motion } from "framer-motion";
import { BlogPost } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from '@/utils/slugify';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Search, Tag, X, Filter, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";

interface BlogCard {
  post: BlogPost;
  viewMode?: "grid" | "list";
  onClick?: () => void;
}

const BlogCard = ({ post, viewMode = "grid", onClick }: BlogCard) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <Card
          className="group cursor-pointer transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5 overflow-hidden"
          onClick={onClick}
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 aspect-video md:aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
              <img
                src={post.coverImage || "https://images.unsplash.com/photo-1587620962725-abab7fe55159"}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="p-6 md:w-2/3 flex flex-col">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </div>
              <h3 className="text-xl font-semibold mb-2 transition-colors group-hover:text-primary-teal line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-auto flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="group/tag transition-colors hover:bg-primary-teal/20"
                  >
                    <Tag className="h-3 w-3 mr-1 transition-transform group-hover/tag:rotate-12" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full"
    >
      <Card
        className="group cursor-pointer h-full flex flex-col transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5 overflow-hidden bg-gradient-to-b from-card to-card/50"
        onClick={onClick}
      >
        <div className="aspect-video relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
          <img
            src={post.coverImage || "https://images.unsplash.com/photo-1587620962725-abab7fe55159"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(post.publishedAt)}
          </div>
          <h3 className="text-xl font-semibold mb-2 transition-colors group-hover:text-primary-teal line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">
            {post.excerpt}
          </p>
          <div className="mt-auto space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="group/tag transition-colors hover:bg-primary-teal/20"
                >
                  <Tag className="h-3 w-3 mr-1 transition-transform group-hover/tag:rotate-12" />
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between hover:bg-transparent hover:text-primary-teal group/btn"
            >
              Read more
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const BlogArchive = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('publishedat', { ascending: false });

      if (error) throw error;

      return data.map((post: any) => ({
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

  const allTags = useMemo(() => {
    if (!blogPosts) return [];
    const tags = new Set<string>();
    blogPosts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    if (!blogPosts) return [];
    return blogPosts.filter(post => {
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => post.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [blogPosts, searchQuery, selectedTags]);

  const handlePostClick = (post: BlogPost) => {
    const postSlug = post.slug || slugify(post.title);
    navigate(`/blog/${encodeURIComponent(postSlug)}`);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mb-12 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-4">
            Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-teal to-secondary-blue">Archive</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our collection of articles about technology, development, and more.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(prev => prev === "grid" ? "list" : "grid")}
                className="shrink-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {allTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-2"
              >
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className={`cursor-pointer group/tag transition-colors ${
                      selectedTags.includes(tag) 
                        ? "hover:bg-primary-teal/80" 
                        : "hover:bg-primary-teal/20"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1 transition-transform group-hover/tag:rotate-12" />
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="h-3 w-3 ml-1 transition-transform group-hover/tag:rotate-90" />
                    )}
                  </Badge>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-12 h-12 text-primary-teal" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">No posts found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`
              grid gap-8
              ${viewMode === "grid" 
                ? "md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
              }
            `}
          >
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                viewMode={viewMode}
                onClick={() => handlePostClick(post)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};