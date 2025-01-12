// components/BlogPostPage.tsx
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Tag, User, Share, ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { useState } from "react";
import { useClipboard } from "@/hooks/use-clipboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPostPageProps {
  postId: string;
}

export const BlogPostPage = ({ postId }: BlogPostPageProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const { data: post, isLoading, error } = useQuery({
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

  if (isLoading) {
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

  if (error || !post) {
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

  const handleShare = async (platform: 'copy' | 'twitter' | 'facebook' | 'linkedin') => {
    const url = window.location.href;
    const title = post.title;

    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-20"
    >
      {/* Hero Section */}
      <header className="relative mb-16">
        {post.coverimage && (
          <div className="absolute inset-0 z-0">
            <img
              src={post.coverimage}
              alt={post.title}
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
          </div>
        )}
        
        <div className="relative z-10 text-center py-20">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6"
          >
            {post.title}
          </motion.h1>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 text-muted-foreground"
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
        </div>
      </header>

      {/* Content Section */}
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

        <motion.aside
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
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
    </motion.article>
  );
};