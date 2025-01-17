import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Tag,
  User,
  ArrowLeft,
  ArrowRight,
  Home,
  Share,
  Calendar,
  Eye,
} from "lucide-react";
import { BlogPost, BlogPostResponse } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/utils/slugify";
import { ShareDialog } from "@/components/ui/share-dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { generateTableOfContents, injectHeadingIds } from "@/utils/toc";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { ScrollToTop } from "@/components/ScrollToTop";

interface BlogPostPageProps {
  postId: string;
}

export const BlogPostPage = ({ postId }: BlogPostPageProps) => {
  const [activeHeading, setActiveHeading] = useState<string>();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Move all transforms outside the render method
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const headerTranslateY = useTransform(scrollY, [0, 100], [-20, 0]);
  const navButtonsOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const nonStickyOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const {
    data: post,
    isLoading: isPostLoading,
    error,
  } = useQuery<BlogPost>({
    queryKey: ["blog-post", postId],
    queryFn: async () => {
      // First try to find by slug
      let { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .eq("slug", postId)
        .maybeSingle();

      // If not found by slug, try by ID
      if (!data) {
        ({ data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("published", true)
          .eq("id", postId)
          .maybeSingle());
      }

      if (error) throw error;
      if (!data) throw new Error("Post not found");

      return {
        id: data.id,
        slug: data.slug || slugify(data.title),
        title: data.title,
        excerpt: data.excerpt || "",
        content: data.content,
        coverImage: data.coverimage || data.image_url || "",
        author: data.author || "Anonymous",
        publishedAt: data.publishedat || data.created_at,
        tags: data.tags || [],
      };
    },
  });

  // Fetch adjacent posts for navigation
  const { data: adjacentPosts } = useQuery({
    queryKey: ["adjacent-posts", postId],
    queryFn: async () => {
      const { data: allPosts } = await supabase
        .from("blogs")
        .select("id, title, slug")
        .eq("published", true)
        .order("publishedat", { ascending: false });

      if (!allPosts) return { prev: null, next: null };

      const currentIndex = allPosts.findIndex(
        (p) => p.id === postId || p.slug === postId
      );
      return {
        prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
        next:
          currentIndex < allPosts.length - 1
            ? allPosts[currentIndex + 1]
            : null,
      };
    },
    enabled: !!post,
  });

  // Fetch related posts based on tags
  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: ["related-posts", post?.tags],
    queryFn: async () => {
      if (!post?.tags?.length) return [];

      const { data } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .neq("id", post.id)
        .contains("tags", post.tags)
        .order("publishedat", { ascending: false })
        .limit(3)
        .returns<BlogPostResponse[]>();

      return (data || []).map((post) => ({
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
    enabled: !!post?.tags?.length,
  });

  // Function to format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Update reading time calculation to be more accurate
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const words = textContent.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" }
    );

    const headings = document.querySelectorAll("h2, h3, h4, h5, h6");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [post]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Process content and generate TOC
  const processContent = (content: string) => {
    const processedContent = injectHeadingIds(content);
    const tocItems = generateTableOfContents(content);
    return { processedContent, tocItems };
  };

  if (isPostLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-32 h-32 mx-auto">
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
              <Eye className="w-12 h-12 text-primary-teal" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Blog Post Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {error?.message ||
              "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/blog")}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Button>
        </motion.div>
      </div>
    );
  }

  const { processedContent, tocItems } = processContent(post.content);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Sticky Header */}
      <motion.header
        style={{ opacity: headerOpacity, y: headerTranslateY }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/40"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.div
                style={{ opacity: navButtonsOpacity }}
                className="flex items-center"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="group px-4"
                >
                  <Link to="/">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2"
                    >
                      <Home className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      <span className="font-medium">Home</span>
                    </motion.div>
                  </Link>
                </Button>
                <div className="h-4 w-px bg-border/40 mx-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="group px-4"
                >
                  <Link to="/archive">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      <span className="font-medium">Blog Archive</span>
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
              <div className="h-4 w-px bg-border/40" />
              {post && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative group cursor-pointer flex-1 max-w-2xl px-4"
                >
                  <h2 className="font-medium truncate text-base sm:text-lg py-1">
                    {post.title}
                  </h2>
                  <motion.div
                    className="absolute -bottom-2 left-4 right-4 h-px bg-gradient-to-r from-primary-teal to-secondary-blue opacity-0 group-hover:opacity-100"
                    layoutId="titleUnderline"
                    transition={{ type: "spring", bounce: 0.3 }}
                  />
                </motion.div>
              )}
            </div>
            <div className="flex items-center divide-x divide-border/40">
              <div className="pr-4">
                <ShareDialog
                  url={`${window.location.origin}/blog/${post.slug || slugify(post.title)}`}
                  title={post.title}
                />
              </div>
              {adjacentPosts?.next && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/blog/${adjacentPosts.next.slug || adjacentPosts.next.id}`
                    )
                  }
                  className="group pl-4 hidden sm:flex items-center gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <span className="font-medium">Next Post</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Navigation buttons for non-sticky state */}
            <motion.div
              style={{ opacity: nonStickyOpacity }}
              className="flex items-center justify-between mb-12"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center divide-x divide-border/40">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="group px-4"
                  >
                    <Link to="/">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2"
                      >
                        <Home className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Home</span>
                      </motion.div>
                    </Link>
                  </Button>
                  <div className="h-4 w-px bg-border/40 mx-2" />
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="group px-4"
                  >
                    <Link to="/archive">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Blog Archive</span>
                      </motion.div>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center divide-x divide-border/40">
                <div className="pr-4">
                  <ShareDialog
                    url={`${window.location.origin}/blog/${post.slug || slugify(post.title)}`}
                    title={post.title}
                  />
                </div>
                {adjacentPosts?.next && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/blog/${adjacentPosts.next.slug || adjacentPosts.next.id}`
                      )
                    }
                    className="group pl-4 hidden sm:flex items-center gap-2"
                  >
                    <motion.div
                      whileHover={{ scale: 0.05 }}
                      className="flex items-center gap-2"
                    >
                      <span className="font-medium">Next Post</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.div>
                  </Button>
                )}
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-teal to-secondary-blue leading-[1.2] md:leading-[1.2] py-1">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {calculateReadingTime(post.content)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
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

            {post.coverImage && (
              <div className="relative aspect-video mb-12 rounded-xl overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary-teal hover:prose-a:text-primary-teal/80 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="hidden lg:block"
            >
              <div className="sticky top-20 space-y-8">
                {tocItems.length > 0 && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Table of Contents
                    </h3>
                    <TableOfContents
                      items={tocItems}
                      activeId={activeHeading}
                      onItemClick={scrollToHeading}
                    />
                  </Card>
                )}
              </div>
            </motion.div>
          </div>

          {(adjacentPosts?.prev || adjacentPosts?.next) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 flex flex-col items-center gap-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {adjacentPosts.prev && (
                  <Card
                    className="group cursor-pointer p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5"
                    onClick={() =>
                      navigate(
                        `/blog/${adjacentPosts.prev.slug || adjacentPosts.prev.id}`
                      )
                    }
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Previous Post
                    </div>
                    <h4 className="font-semibold group-hover:text-primary-teal transition-colors">
                      {adjacentPosts.prev.title}
                    </h4>
                  </Card>
                )}
                {adjacentPosts.next && (
                  <Card
                    className="group cursor-pointer p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5"
                    onClick={() =>
                      navigate(
                        `/blog/${adjacentPosts.next.slug || adjacentPosts.next.id}`
                      )
                    }
                  >
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                      Next Post
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <h4 className="font-semibold text-right group-hover:text-primary-teal transition-colors">
                      {adjacentPosts.next.title}
                    </h4>
                  </Card>
                )}
              </div>

              <Link
                to="/archive"
                className="group flex items-center gap-2 text-primary-teal hover:text-primary-teal transition-colors"
              >
                View all blog posts
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}

          {relatedPosts && relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-20"
            >
              <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Card
                      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5 h-full flex flex-col"
                      onClick={() =>
                        navigate(`/blog/${relatedPost.slug || relatedPost.id}`)
                      }
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                        <img
                          src={
                            relatedPost.coverImage ||
                            "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
                          }
                          alt={relatedPost.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-lg font-semibold mb-2 transition-colors group-hover:text-primary-teal">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(relatedPost.publishedAt)}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};
