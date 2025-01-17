import { motion } from "framer-motion";
import { BlogPost } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/utils/slugify";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Search,
  Tag,
  X,
  Filter,
  ArrowRight,
  Clock,
  User,
  Share,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ViewToggle } from "./blogpost_page/ViewToggle";
import { AnimatePresence } from "framer-motion";
import { BlogArchiveHeader } from "./blogpost_page/BlogArchiveHeader";
import { ShareDialog } from "@/components/ui/share-dialog";

interface BlogCard {
  post: BlogPost;
  viewMode?: "grid" | "list";
  onClick?: () => void;
}

const BlogCard = ({ post, viewMode = "grid", onClick }: BlogCard) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const words = textContent.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
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
          className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5 flex flex-col md:flex-row bg-gradient-to-b from-card to-card/50"
          onClick={onClick}
        >
          <div className="md:w-48 aspect-video md:aspect-square relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
            <img
              src={
                post.coverImage ||
                "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
              }
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <Badge
                variant="secondary"
                className="bg-background/50 backdrop-blur-sm"
              >
                {calculateReadingTime(post.content)}
              </Badge>
            </div>
          </div>
          <div className="p-6 flex-grow flex flex-col">
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
            <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary-teal line-clamp-2">
              {post.title}
            </h3>
            <p className="mb-4 text-muted-foreground line-clamp-3 flex-grow">
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
              <div
                className="flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 hover:bg-transparent hover:text-primary-teal group/btn"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
                <ShareDialog
                  url={`${window.location.origin}/blog/${post.slug || slugify(post.title)}`}
                  title={post.title}
                />
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="h-full"
    >
      <Card
        className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5 h-full flex flex-col bg-gradient-to-b from-card to-card/50"
        onClick={onClick}
      >
        <div className="aspect-video overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
          <img
            src={
              post.coverImage ||
              "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
            }
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 z-20">
            <Badge
              variant="secondary"
              className="bg-background/50 backdrop-blur-sm"
            >
              {calculateReadingTime(post.content)}
            </Badge>
          </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
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
          <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary-teal line-clamp-2">
            {post.title}
          </h3>
          <p className="mb-4 text-muted-foreground line-clamp-3 flex-grow">
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
            <div
              className="flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-0 hover:bg-transparent hover:text-primary-teal group/btn"
              >
                Read more
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              <ShareDialog
                url={`${window.location.origin}/blog/${post.slug || slugify(post.title)}`}
                title={post.title}
              />
            </div>
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("publishedat", { ascending: false });

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
        tags: post.tags || [],
      }));
    },
  });

  const allTags = useMemo(() => {
    if (!blogPosts) return [];
    const tags = new Set<string>();
    blogPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [blogPosts]);

  const toggleTag = (tag: string) => {
    if (tag === "All") {
      setSelectedTags(
        selectedTags.length === allTags.length ? [] : [...allTags]
      );
      return;
    }
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const filteredPosts = useMemo(() => {
    if (!blogPosts) return [];
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [blogPosts, searchQuery, selectedTags]);

  const handlePostClick = (post: BlogPost) => {
    const postSlug = post.slug || slugify(post.title);
    navigate(`/blog/${encodeURIComponent(postSlug)}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-20 max-w-[1400px]">
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
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
    <>
      <BlogArchiveHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedTags={selectedTags}
        onClearTags={() => setSelectedTags([])}
        allTags={allTags}
        onToggleTag={toggleTag}
        isScrolled={isScrolled}
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-8 py-20 max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl font-bold mb-4">
              Blog{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-teal to-secondary-blue">
                Archive
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our collection of articles about technology, development,
              and more.
            </p>

            {!isScrolled && (
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
                  <div className="flex gap-3">
                    <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedTags([])}
                      disabled={selectedTags.length === 0}
                      className="relative h-9 w-9"
                    >
                      <Filter className="h-4 w-4 translate-y-[2px]" />
                      {selectedTags.length > 0 && (
                        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary-teal text-[9px] text-primary-foreground flex items-center justify-center shadow-sm">
                          {selectedTags.length}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {allTags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap gap-2"
                  >
                    <Badge
                      variant={
                        selectedTags.length === allTags.length
                          ? "default"
                          : "secondary"
                      }
                      className={`cursor-pointer group/tag transition-colors ${
                        selectedTags.length === allTags.length
                          ? "bg-primary-teal hover:bg-primary-teal/90"
                          : "hover:bg-primary-teal/20"
                      }`}
                      onClick={() => toggleTag("All")}
                    >
                      <Tag className="h-3 w-3 mr-1 transition-transform group-hover/tag:rotate-12" />
                      All
                    </Badge>
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "secondary"
                        }
                        className={`cursor-pointer group/tag transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-primary-teal hover:bg-primary-teal/90"
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
            )}
          </motion.div>

          <motion.div
            layout
            className={`grid gap-8 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  viewMode={viewMode}
                  onClick={() => handlePostClick(post)}
                />
              ))}
            </AnimatePresence>
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
                Try adjusting your search or filter criteria to find what you're
                looking for.
              </p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </>
  );
};
