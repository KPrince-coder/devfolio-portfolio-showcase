import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash,
  Tag,
  Calendar,
  Link,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
} from "lucide-react";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
}

type SortField = "title" | "publishedAt" | "modifiedAt";
type SortOrder = "asc" | "desc";

export const BlogList = ({ posts, onEdit, onDelete }: BlogListProps) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("publishedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPublished, setShowPublished] = useState<boolean | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Get unique tags from all posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesSearch =
          search === "" ||
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
          post.tags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          );

        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => post.tags?.includes(tag));

        const matchesPublished =
          showPublished === null ||
          (showPublished === true && post.status === "published") ||
          (showPublished === false && post.status === "draft");

        return matchesSearch && matchesTags && matchesPublished;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "publishedAt":
            comparison =
              new Date(a.publishedAt).getTime() -
              new Date(b.publishedAt).getTime();
            break;
          case "modifiedAt":
            comparison =
              new Date(a.modifiedAt || 0).getTime() -
              new Date(b.modifiedAt || 0).getTime();
            break;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [posts, search, sortField, sortOrder, selectedTags, showPublished]);

  const optimisticDelete = (postId: string) => {
    const currentData = queryClient.getQueryData(["blog-posts-admin"]);
    queryClient.setQueryData(["blog-posts-admin"], (old: any) =>
      old.filter((post: BlogPost) => post.id !== postId)
    );
    return { currentData };
  };

  const handleDelete = (postId: string) => {
    setDeleteConfirm(null);
    const { currentData } = optimisticDelete(postId);
    onDelete(postId);
  };

  const handleCopyLink = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${encodeURIComponent(post.slug)}`;
    navigator.clipboard.writeText(url);
    toast.success("Blog link copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={sortField}
            onValueChange={(v) => setSortField(v as SortField)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="publishedAt">Published Date</SelectItem>
              <SelectItem value="modifiedAt">Modified Date</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setShowPublished(
                showPublished === null
                  ? true
                  : showPublished === true
                    ? false
                    : null
              )
            }
          >
            {showPublished === null ? (
              <Eye className="h-4 w-4" />
            ) : showPublished ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
              className="h-7"
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {filteredAndSortedPosts.map((post: BlogPost) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  {post.status === "draft" && (
                    <span className="text-xs text-yellow-500 font-medium">
                      Draft
                    </span>
                  )}
                </div>
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
                    onClick={() => setDeleteConfirm(post.id)}
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
                  className="mt-2 max-h-40 w-full object-cover rounded"
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
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Published: {new Date(post.publishedAt).toLocaleString()}
                  </span>
                </div>
                {post.modifiedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Modified: {new Date(post.modifiedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm text-muted-foreground space-y-1">
                <p className="font-mono">URL: /blog/{post.slug}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post and remove all of its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
