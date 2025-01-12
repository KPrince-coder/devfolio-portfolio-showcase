// components/BlogPostPage.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Tag, User, Share, ArrowLeft, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface BlogPostPageProps {
  postId: string;
}

export const BlogPostPage = ({ postId }: BlogPostPageProps) => {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  // Fetch current post
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ['blog-post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      return data;
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

  const handleShare = async (platform: 'copy' | 'twitter' | 'facebook' | 'linkedin') => {
    const url = `${window.location.origin}/blog/${postId}`;
    const title = post?.title || '';

    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
    }
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
            <Link 
              to="/archive"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Archive
            </Link>
            <div className="flex items-center gap-4">
              {adjacentPosts?.prev && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/blog/${adjacentPosts.prev.id}`)}
                >
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
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative py-20 overflow-hidden">
          {post.coverimage && (
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={post.coverimage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
            </motion.div>
          )}
          
          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                {post.title}
              </h1>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground"
              >
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {new Date(post.publishedat).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-6 lg:sticky lg:top-24"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Share this post</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShare('copy')}
                  >
                    <Share className="mr-2 h-4 w-4" />
                    {isCopied ? "Copied!" : "Copy link"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShare('twitter')}
                  >
                    Share on Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShare('facebook')}
                  >
                    Share on Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShare('linkedin')}
                  >
                    Share on LinkedIn
                  </Button>
                </div>
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
            {/* Add related posts grid here */}
          </div>
        </section>
      </motion.article>
    </AnimatePresence>
  );
};