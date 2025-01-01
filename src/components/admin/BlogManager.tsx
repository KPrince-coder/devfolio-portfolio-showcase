import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const BlogManager = () => {
  // In production, blog posts would be fetched from Supabase
  const posts: any[] = [];

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Blog Posts</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{post.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          No blog posts yet
        </div>
      )}
    </Card>
  );
};