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
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { ShareDialog } from "@/components/ui/share-dialog";

interface BlogCardProps {
  post: BlogPost;
  viewMode: "grid" | "list";
  onClick: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, viewMode, onClick }) => {
  const shareUrl = `${window.location.origin}/blog/${post.slug || slugify(post.title)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={viewMode === "grid" ? "h-full" : "w-full"}
    >
      <Card
        className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl ${
          viewMode === "list" ? "flex h-64" : "flex flex-col h-full"
        }`}
        onClick={onClick}
      >
        <div className={`
          overflow-hidden flex-shrink-0
          ${viewMode === "list" ? "w-72" : "aspect-video"}
        `}>
          <img
            src={post.coverImage || "https://images.unsplash.com/photo-1587620962725-abab7fe55159"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <div className={`
          flex flex-col flex-grow
          ${viewMode === "list" ? "w-full p-6" : "p-6"}
        `}>
          <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          </div>
          <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary line-clamp-2">
            {post.title}
          </h3>
          <p className="mb-4 text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, viewMode === "list" ? 3 : undefined).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              {viewMode === "list" && post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ShareDialog url={shareUrl} title={post.title} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/80"
    >
      {/* Updated Navigation Bar spacing */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span className="text-sm text-muted-foreground">
              /
            </span>
            <span className="text-sm">
              Blog Archive
            </span>
          </div>
        </div>
      </nav>

      <section className="py-12">
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
                className="w-full focus-visible:ring-1 focus-visible:ring-offset-0"
              />
              
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="focus-visible:ring-1 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  {allTags.map(tag => (
                    <SelectItem 
                      key={tag} 
                      value={tag}
                      className="focus:bg-accent focus:text-accent-foreground"
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <SelectTrigger className="focus-visible:ring-1 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem 
                    value="latest"
                    className="focus:bg-accent focus:text-accent-foreground"
                  >
                    Latest First
                  </SelectItem>
                  <SelectItem 
                    value="oldest"
                    className="focus:bg-accent focus:text-accent-foreground"
                  >
                    Oldest First
                  </SelectItem>
                  <SelectItem 
                    value="title"
                    className="focus:bg-accent focus:text-accent-foreground"
                  >
                    By Title
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                  size="icon"
                  className="focus-visible:ring-1 focus-visible:ring-offset-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  size="icon"
                  className="focus-visible:ring-1 focus-visible:ring-offset-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Tags ScrollArea */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              {/* Add fade effects on edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
              
              {/* Scrollable container with added padding */}
              <div className="overflow-x-auto flex-nowrap hide-scrollbar px-4">
                <div className="flex gap-2 pb-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer whitespace-nowrap hover:bg-accent/50"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

          {/* Posts Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              // Include all filter states in the key
              key={`${viewMode}-${searchQuery}-${selectedTag}-${sortBy}`}
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
                  onClick={() => navigate(`/blog/${post.slug || slugify(post.title)}`)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
};

// Add this CSS either in your global CSS file or as a style tag
const styles = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;            /* Chrome, Safari and Opera */
  }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default BlogArchive;