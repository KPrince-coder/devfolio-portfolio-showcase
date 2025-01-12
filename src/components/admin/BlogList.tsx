import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Tag, Calendar, Link } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";

interface BlogListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
}

export const BlogList = ({ posts, onEdit, onDelete }: BlogListProps) => {
  const handleCopyLink = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${encodeURIComponent(post.slug)}`;
    navigator.clipboard.writeText(url);
    toast.success("Blog link copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      {posts?.map((post: BlogPost) => (
        <Card key={post.id} className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium">{post.title}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLink(post)}
                title="Copy blog link"
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(post.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{post.excerpt}</p>
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="mt-2 max-h-40 object-cover rounded"
            />
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <p className="text-sm text-muted-foreground">
              Published: {new Date(post.publishedAt).toLocaleString()}
            </p>
            {post.modifiedAt && (
              <p className="text-sm text-muted-foreground">
                Modified: {new Date(post.modifiedAt).toLocaleString()}
              </p>
            )}
          </div>
          <div className="mt-2 text-sm text-muted-foreground space-y-1">
            <p>ID: {post.id}</p>
            <p>Slug: {post.slug}</p>
            <p>URL: /blog/{encodeURIComponent(post.slug)}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};