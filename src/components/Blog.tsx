import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Tag, User, Share, ArrowRight } from "lucide-react";
import { useState } from "react";
import { BlogPost } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { slugify } from "@/utils/blogUtils";
import { ShareDialog } from "@/components/ui/share-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Blog = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

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

  const handlePostClick = (post: BlogPost) => {
    const postSlug = post.slug || slugify(post.title);
    navigate(`/blog/${encodeURIComponent(postSlug)}`);
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const words = textContent.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
      </section>
    );
  }

  if (!blogPosts || blogPosts.length === 0) {
    return (
      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="relative w-32 h-32 mb-8">
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
                <Tag className="w-12 h-12 text-primary-teal" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">No blogs available</h2>
            <p className="text-muted-foreground max-w-md">
              We're working on creating amazing content for you. Check back
              soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            Latest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-teal to-secondary-blue">
              Blog Posts
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights and thoughts on technology, development, and more. Join me
            on this journey of continuous learning and discovery.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(showMore ? blogPosts : blogPosts?.slice(0, 3))?.map(
            (post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card
                  className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5 h-full flex flex-col bg-gradient-to-b from-card to-card/50"
                  onClick={() => handlePostClick(post)}
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
            )
          )}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          {blogPosts?.length > 3 && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowMore(!showMore)}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10">
                {showMore ? "Show less" : "Show more"}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-teal/20 to-secondary-blue/20 -z-10"
                initial={false}
                animate={{
                  x: ["0%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </Button>
          )}
          <Link
            to="/archive"
            className="group flex items-center gap-2 text-primary-teal hover:text-primary-teal transition-colors"
          >
            View all blog posts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
