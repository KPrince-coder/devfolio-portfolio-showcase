import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatDate } from "@/utils/blogUtils";
import { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  posts: BlogPost[];
  className?: string;
}

const RelatedPostCard = memo(({ post }: { post: BlogPost }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-lg dark:hover:shadow-primary-teal/5 transition-all duration-300"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      <div className="aspect-video overflow-hidden relative">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            aria-hidden="true"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="line-clamp-2 group-hover:text-primary-teal transition-colors">
          <a
            href={`/blog/${post.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/blog/${post.slug}`);
            }}
            className="outline-none focus-visible:ring-2 focus-visible:ring-primary-teal rounded-sm"
          >
            {post.title}
          </a>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      <CardFooter className="text-sm text-muted-foreground">
        <div className="flex items-center gap-4 w-full">
          <time
            dateTime={new Date(post.createdAt).toISOString()}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {formatDate(post.createdAt)}
          </time>
          <div className="flex items-center gap-2 ml-auto">
            <User className="h-4 w-4" aria-hidden="true" />
            <span>{post.author}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
});

RelatedPostCard.displayName = "RelatedPostCard";

export function RelatedPosts({ posts, className }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className={cn("", className)}
      aria-labelledby="related-posts-heading"
    >
      <h2 id="related-posts-heading" className="text-2xl font-bold mb-6">
        Related Posts
      </h2>
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        role="list"
        aria-label="Related blog posts"
      >
        {posts.map((post) => (
          <div key={post.id} role="listitem">
            <RelatedPostCard post={post} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
