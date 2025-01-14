// components/BlogPostPage.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Tag, User, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { BlogPost, BlogPostResponse } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from '@/utils/slugify';
import { ShareDialog } from "@/components/ui/share-dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { generateTableOfContents, injectHeadingIds } from "@/utils/toc";
import { TableOfContents } from "@/components/ui/table-of-contents";


interface BlogPostPageProps {
  postId: string;
}

export const BlogPostPage = ({ postId }: BlogPostPageProps) => {
  const [activeHeading, setActiveHeading] = useState<string>();
  const navigate = useNavigate();

  const { data: post, isLoading: isPostLoading, error } = useQuery<BlogPost>({
    queryKey: ['blog-post', postId],
    queryFn: async () => {
      // First try to find by slug
      let { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .eq('slug', postId)
        .maybeSingle();

      // If not found by slug, try by ID
      if (!data) {
        ({ data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .eq('id', postId)
          .maybeSingle());
      }

      if (error) throw error;
      if (!data) throw new Error('Post not found');

      return {
        id: data.id,
        slug: data.slug || slugify(data.title),
        title: data.title,
        excerpt: data.excerpt || "",
        content: data.content,
        coverImage: data.coverimage || data.image_url || "",
        author: data.author || "Anonymous",
        publishedAt: data.publishedat || data.created_at,
        tags: data.tags || []
      };
    }
  });

  // Fetch adjacent posts for navigation
  const { data: adjacentPosts } = useQuery({
    queryKey: ['adjacent-posts', postId],
    queryFn: async () => {
      const { data: allPosts } = await supabase
        .from('blogs')
        .select('id, title')
        .eq('published', true)
        .order('publishedat', { ascending: false });

      if (!allPosts) return { prev: null, next: null };

      const currentIndex = allPosts.findIndex(p => p.id === postId);
      return {
        prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
        next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
      };
    },
    enabled: !!post
  });

  // Fetch related posts based on tags
  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: ['related-posts', post?.tags],
    queryFn: async () => {
      if (!post?.tags?.length) return [];

      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .neq('id', post.id)
        .contains('tags', post.tags)
        .order('publishedat', { ascending: false })
        .limit(3)
        .returns<BlogPostResponse[]>();

      return (data || []).map(post => ({
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
    },
    enabled: !!post?.tags?.length
  });

  // Function to format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Update reading time calculation to be more accurate
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
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
      { rootMargin: '-100px 0px -66% 0px' }
    );

    const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
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
        behavior: "smooth"
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
        <div className="space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/4 mx-auto" />
          <Skeleton className="h-[400px] w-full" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Blog Post</h2>
        <p className="text-muted-foreground mb-8">
          {error?.message || "Blog post not found"}
        </p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  const { processedContent, tocItems } = processContent(post.content);

  return (
    <AnimatePresence mode="wait">
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-b from-background to-background/80"
      >
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg border-b border-border/40">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                to="/archive"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Archive
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {adjacentPosts?.prev && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/blog/${adjacentPosts.prev.id}`)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Post
                </Button>
              )}
              {adjacentPosts?.next && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/blog/${adjacentPosts.next.id}`)}
                >
                  Next Post
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Enhanced Header Section with Title and Meta */}
        <header className="container mx-auto px-4 pt-12 pb-8 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight"
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-2 hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
            </motion.div>
          </motion.div>
        </header>

        {/* Hero Image Section */}
        {post.coverImage && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="container mx-auto px-4 mb-8"
          >
            <div className="relative max-w-5xl mx-auto aspect-[21/9] overflow-hidden rounded-lg shadow-2xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Simplified Reading Time Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="sticky top-16 z-10 bg-background/80 backdrop-blur-sm border-y"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-2">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Estimation:{" "}
                {calculateReadingTime(post.content)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content and Sidebar */}
        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-3 relative" // Added relative positioning
            >
              <div
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-6 lg:sticky lg:top-24 lg:self-start" // Added self-start
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Share this post</h3>
                <ShareDialog 
                  url={`${window.location.origin}/blog/${post.slug || post.id}`}
                  title={post.title}
                />
              </Card>

              {post.tags && post.tags.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </motion.aside>
          </div>
        </main>

        {/* Related Posts */}
        <section className="bg-accent/10 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">More Posts</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts?.map((relatedPost) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col"
                    onClick={() => navigate(`/blog/${relatedPost.slug || slugify(relatedPost.title)}`)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.coverImage || "https://images.unsplash.com/photo-1587620962725-abab7fe55159"}
                        alt={relatedPost.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(relatedPost.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {relatedPost.author}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="mb-4 text-muted-foreground line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {relatedPost.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link 
                to="/archive"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                View all posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Updated Table of Contents */}
        {tocItems.length > 0 && (
          <div className="fixed top-24 right-4 w-64 hidden xl:block">
            <TableOfContents
              items={tocItems}
              activeId={activeHeading}
              onItemClick={scrollToHeading}
            />
          </div>
        )}
      </motion.article>
    </AnimatePresence>
  );
};