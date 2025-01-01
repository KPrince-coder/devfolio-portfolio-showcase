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
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Getting Started with React and TypeScript",
      excerpt: "Learn how to set up a new React project with TypeScript and best practices for type safety.",
      content: `<div class="prose prose-invert">
        <p>TypeScript has become an essential tool in modern React development. In this guide, we'll explore how to set up a new React project with TypeScript and discuss best practices for maintaining type safety throughout your application.</p>
        <h2>Why TypeScript?</h2>
        <p>TypeScript adds static typing to JavaScript, which helps catch errors early in development and improves code maintainability.</p>
        <h2>Setting Up Your Project</h2>
        <p>To create a new React project with TypeScript, you can use Create React App with the TypeScript template...</p>
      </div>`,
      coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
      author: "John Doe",
      publishedAt: "2024-03-10",
      tags: ["React", "TypeScript", "Web Development"]
    },
    {
      id: "2",
      title: "Building Scalable Android Apps with Jetpack Compose",
      excerpt: "Discover how to create modern Android applications using Jetpack Compose.",
      content: `<div class="prose prose-invert">
        <p>Jetpack Compose is revolutionizing Android UI development. This article explores how to build scalable and maintainable Android applications using this modern toolkit.</p>
        <h2>Introduction to Compose</h2>
        <p>Jetpack Compose is Android's modern toolkit for building native UI. It simplifies and accelerates UI development on Android.</p>
        <h2>Key Concepts</h2>
        <p>Learn about composable functions, state management, and side effects in Jetpack Compose...</p>
      </div>`,
      coverImage: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb",
      author: "Jane Smith",
      publishedAt: "2024-03-08",
      tags: ["Android", "Jetpack Compose", "Mobile Development"]
    },
    {
      id: "3",
      title: "Data Engineering Best Practices",
      excerpt: "Essential practices for building robust data pipelines and ETL processes.",
      content: `<div class="prose prose-invert">
        <p>Data engineering is crucial for modern applications. This guide covers best practices for building reliable data pipelines and ETL processes.</p>
        <h2>Pipeline Architecture</h2>
        <p>Learn about different architectural patterns for data pipelines and when to use each one.</p>
        <h2>Data Quality</h2>
        <p>Discover techniques for ensuring data quality and implementing proper validation...</p>
      </div>`,
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      author: "Alex Johnson",
      publishedAt: "2024-03-05",
      tags: ["Data Engineering", "ETL", "Big Data"]
    }
  ];

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
      </div>

      <BlogModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </section>
  );
};