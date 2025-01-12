import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Tag, User, Share } from "lucide-react";
import { useState } from "react";
import { BlogPost } from "@/types/blog";
import { BlogModal } from "./BlogModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

export const Blog = () => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showMore, setShowMore] = useState(false);

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      console.log("Fetching blog posts...");
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('publishedat', { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }

      console.log("Blog posts fetched:", data);
      
      return data.map((post: any) => ({
        id: post.id,
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

  const handlePostClick = (post: BlogPost) => {
    window.open(`/blog/${post.id}`, '_blank'); // Open in new tab
  };

  if (isLoading) {
    return (
      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading blog posts...</div>
        </div>
      </section>
    );
  }

  if (!blogPosts || blogPosts.length === 0) {
    return (
      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-screen">
            <img
              src="https://images.unsplash.com/photo-1587620962725-abab7fe55159"
              alt="No blogs available"
              className="h-40 w-40 object-cover rounded-full"
            />
            <h2 className="mt-4 text-2xl font-bold">No blogs available</h2>
            <p className="mt-2 text-muted-foreground">
              We're sorry, but it looks like there are no blogs available at the moment.
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
          <h2 className="text-4xl font-bold">
            Latest <span className="text-primary">Blog Posts</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Insights and thoughts on technology, development, and more
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(showMore ? blogPosts : blogPosts?.slice(0, 3))?.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card
                className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl"
                onClick={() => handlePostClick(post)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.coverImage || "https://images.unsplash.com/photo-1587620962725-abab7fe55159"}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    <span className="flex items-center gap-1">
                      <User   className="h-4 w-4" />
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
                    onClick={() => {
                      const url = `${window.location.href}#${post.id}`;
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }}
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          {blogPosts?.length > 3 && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less" : "Show more"}
            </Button>
          )}
          <Link 
            to="/archive" 
            className="text-primary hover:text-primary-dark transition-colors"
          >
            View all blog posts
          </Link>
        </div>
      </div>
    </section>
  );
};