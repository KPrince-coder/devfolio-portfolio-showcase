import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Tag, User } from "lucide-react";
import { useState } from "react";
import { BlogPost } from "@/types/blog";
import { BlogModal } from "./BlogModal";

export const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Sample blog posts - in production, this would come from Supabase
  const blogPosts: BlogPost[] = [];

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

        {blogPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.coverImage}
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
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-accent/10 p-8 text-center"
          >
            <div className="mb-4 rounded-full bg-accent/20 p-6">
              <svg
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">No Blog Posts Yet</h3>
            <p className="mb-6 text-muted-foreground">
              Stay tuned! Blog posts will be coming soon.
            </p>
            <Button variant="outline" className="group relative overflow-hidden">
              <span className="relative z-10">Check Back Later</span>
              <div className="absolute inset-0 transform bg-gradient-to-r from-primary/20 to-primary/40 transition-transform duration-300 group-hover:scale-110" />
            </Button>
          </motion.div>
        )}
      </div>

      <BlogModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </section>
  );
};