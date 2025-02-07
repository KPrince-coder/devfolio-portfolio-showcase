import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BlogPost, BlogPostResponse, TocItem } from "@/types/blog";
import { formatDate } from "@/utils/blogUtils";
import { Calendar, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Tag,
  ArrowLeft,
  ArrowRight,
  Home,
  Share,
  Eye,
  Menu,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/utils/slugify";
import { ShareDialog } from "@/components/ui/share-dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { generateTableOfContents, injectHeadingIds } from "@/utils/toc";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Helmet } from "react-helmet-async";
import { RelatedPosts } from "@/components/blog/RelatedPosts";

interface BlogPostPageProps {
  postId: string;
}

export const BlogPostPage = ({ postId }: BlogPostPageProps) => {
  const [activeHeading, setActiveHeading] = useState<string>();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [readingTime, setReadingTime] = useState<string>("");

  // Move all transforms outside the render method
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const headerTranslateY = useTransform(scrollY, [0, 100], [-20, 0]);
  const navButtonsOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const nonStickyOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const {
    data: post,
    isLoading: isPostLoading,
    error,
  } = useQuery<BlogPost>({
    queryKey: ["blog-post", postId],
    queryFn: async () => {
      // First try to find by slug
      let { data: dbPost, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .eq("slug", postId)
        .maybeSingle();

      // If not found by slug, try by ID
      if (!dbPost) {
        ({ data: dbPost, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("published", true)
          .eq("id", postId)
          .maybeSingle());
      }

      if (error) throw error;
      if (!dbPost) throw new Error("Post not found");

      // Transform database post to application post
      return {
        id: dbPost.id,
        title: dbPost.title,
        content: dbPost.content,
        excerpt: dbPost.excerpt || "",
        imageUrl: dbPost.image_url || "",
        published: dbPost.published,
        createdAt: dbPost.created_at,
        updatedAt: dbPost.updated_at,
        author: dbPost.author || "Anonymous",
        tags: dbPost.tags || [],
        slug: dbPost.slug,
        viewCount: dbPost.viewcount || 0,
        hasLiked: dbPost.hasliked || false,
        likeCount: dbPost.like_count || 0,
        commentCount: dbPost.comment_count || 0,
        readingTime: dbPost.reading_time || 0,
        category: dbPost.category || "",
        status: dbPost.status || "draft",
        metaTitle: dbPost.meta_title || "",
        metaDescription: dbPost.meta_description || "",
        metaKeywords: dbPost.meta_keywords || "",
        canonicalUrl: dbPost.canonical_url || "",
        coverImage: dbPost.coverimage || dbPost.image_url || "",
      };
    },
  });

  // Fetch adjacent posts for navigation
  const { data: adjacentPosts } = useQuery({
    queryKey: ["adjacent-posts", postId],
    queryFn: async () => {
      const { data: allPosts } = await supabase
        .from("blogs")
        .select("id, title, slug")
        .eq("published", true)
        .order("publishedat", { ascending: false });

      if (!allPosts) return { prev: null, next: null };

      const currentIndex = allPosts.findIndex(
        (p) => p.id === postId || p.slug === postId
      );
      return {
        prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
        next:
          currentIndex < allPosts.length - 1
            ? allPosts[currentIndex + 1]
            : null,
      };
    },
    enabled: !!post,
  });

  // Get related posts based on tags
  const {
    data: relatedPosts,
    isLoading: isRelatedLoading,
    error: relatedError,
  } = useQuery<BlogPost[]>({
    queryKey: ["related-posts", post?.tags],
    enabled: !!post?.tags && !!post?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .neq("id", post?.id)
        .overlaps("tags", post?.tags || [])
        .limit(3);

      if (error) throw error;
      if (!data) return [];

      return data.map((dbPost) => ({
        id: dbPost.id,
        title: dbPost.title,
        content: dbPost.content,
        excerpt: dbPost.excerpt || "",
        imageUrl: dbPost.image_url || "",
        published: dbPost.published,
        createdAt: dbPost.created_at,
        updatedAt: dbPost.updated_at,
        author: dbPost.author || "Anonymous",
        tags: dbPost.tags || [],
        slug: dbPost.slug || slugify(dbPost.title),
        viewCount: dbPost.viewcount || 0,
        hasLiked: dbPost.hasliked || false,
        likeCount: dbPost.like_count || 0,
        commentCount: dbPost.comment_count || 0,
        readingTime: dbPost.reading_time || 0,
        category: dbPost.category || "",
        status: dbPost.status || "draft",
        metaTitle: dbPost.meta_title || "",
        metaDescription: dbPost.meta_description || "",
        metaKeywords: dbPost.meta_keywords || "",
        canonicalUrl: dbPost.canonical_url || "",
        coverImage: dbPost.coverimage || dbPost.image_url || "",
      }));
    },
  });

  // Function to format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Update reading time calculation to be more accurate
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const words = textContent.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" }
    );

    const headings = document.querySelectorAll("h2, h3, h4, h5, h6");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [post]);

  useEffect(() => {
    if (post?.content) {
      const wordsPerMinute = 200;
      const words = post.content.trim().split(/\s+/).length;
      const time = Math.ceil(words / wordsPerMinute);
      setReadingTime(`${time} min read`);
    }
  }, [post?.content]);

  const generateStructuredData = (post: BlogPost) => {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      image: post.coverImage,
      author: {
        "@type": "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Your Blog Name",
        logo: {
          "@type": "ImageObject",
          url: "your-logo-url",
        },
      },
      datePublished: new Date(post.createdAt).toISOString(),
      dateModified: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : new Date(post.createdAt).toISOString(),
      keywords: post.metaKeywords || post.tags.join(", "),
      articleBody: post.content.replace(/<[^>]*>/g, ""), // Strip HTML tags
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${window.location.origin}/blog/${post.slug}`,
      },
    };
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Process content and generate TOC
  const processedContent = useMemo(
    () => injectHeadingIds(post?.content || ""),
    [post?.content]
  );
  const tocItems = useMemo(
    () => generateTableOfContents(post?.content || ""),
    [post?.content]
  );

  if (isPostLoading) {
    return (
      <div className="px-4 py-20">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-32 h-32 mx-auto">
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
              <Eye className="w-12 h-12 text-primary-teal" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Blog Post Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {error?.message ||
              "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/archive")}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog Archive
          </Button>
        </motion.div>
      </div>
    );
  }

  const canonicalUrl =
    post.canonicalUrl || `${window.location.origin}/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>
          {post?.title} | {import.meta.env.VITE_APP_TITLE || "Blog"}
        </title>
        <meta name="description" content={post?.excerpt || ""} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post?.title} />
        <meta property="og:description" content={post?.excerpt} />
        <meta property="og:url" content={window.location.href} />
        {post?.coverImage && (
          <meta property="og:image" content={post.coverImage} />
        )}
        <meta
          property="og:site_name"
          content={import.meta.env.VITE_APP_TITLE || "Blog"}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.title} />
        <meta name="twitter:description" content={post?.excerpt} />
        {post?.coverImage && (
          <meta name="twitter:image" content={post.coverImage} />
        )}

        {/* Article Specific */}
        <meta property="article:published_time" content={post?.createdAt} />
        <meta property="article:author" content={post?.author} />
        {post?.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* LinkedIn Specific */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        {/* Sticky Header */}
        <motion.header
          style={{
            opacity: headerOpacity,
            y: headerTranslateY,
          }}
          className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="flex h-14 items-center justify-between gap-4 px-4">
            {/* Left Section: Navigation Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/archive")}
                className="hidden md:flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Blog Archive
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="hidden md:flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>

            {/* Center Section: Title */}
            <h1 className="flex-1 text-xl font-semibold line-clamp-1 text-left">
              {post?.title}
            </h1>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                <ShareDialog
                  url={`${window.location.origin}/blog/${post?.slug || slugify(post?.title || "")}`}
                  title={post?.title || ""}
                />

                {adjacentPosts?.prev && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate(
                        `/blog/${adjacentPosts.prev.slug || adjacentPosts.prev.id}`
                      )
                    }
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}

                {adjacentPosts?.next && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate(
                        `/blog/${adjacentPosts.next.slug || adjacentPosts.next.id}`
                      )
                    }
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col gap-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/archive")}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Blog Archive
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/")}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Home
                      </Button>

                      <ShareDialog
                        url={`${window.location.origin}/blog/${post?.slug || slugify(post?.title || "")}`}
                        title={post?.title || ""}
                      />

                      <div className="flex gap-2 mt-4">
                        {adjacentPosts?.prev && (
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              navigate(
                                `/blog/${adjacentPosts.prev.slug || adjacentPosts.prev.id}`
                              )
                            }
                          >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Previous
                          </Button>
                        )}

                        {adjacentPosts?.next && (
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              navigate(
                                `/blog/${adjacentPosts.next.slug || adjacentPosts.next.id}`
                              )
                            }
                          >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* Navigation buttons for non-sticky state */}
              <motion.div
                style={{ opacity: nonStickyOpacity }}
                className="flex items-center justify-between mb-12"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center divide-x divide-border/40">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="group px-4"
                    >
                      <Link to="/">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2"
                        >
                          <Home className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                          <span className="font-medium">Home</span>
                        </motion.div>
                      </Link>
                    </Button>
                    <div className="h-4 w-px bg-border/40 mx-2" />
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="group px-4"
                    >
                      <Link to="/archive">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                          <span className="font-medium">Blog Archive</span>
                        </motion.div>
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center divide-x divide-border/40">
                  <div className="pr-4">
                    <ShareDialog
                      url={`${window.location.origin}/blog/${post.slug || slugify(post.title)}`}
                      title={post.title}
                    />
                  </div>
                  {adjacentPosts?.next && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate(
                          `/blog/${adjacentPosts.next.slug || adjacentPosts.next.id}`
                        )
                      }
                      className="group pl-4 hidden sm:flex items-center gap-2"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2"
                      >
                        <span className="font-medium">Next Post</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </motion.div>
                    </Button>
                  )}
                </div>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-teal to-secondary-blue leading-[1.2] md:leading-[1.2] py-1">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {readingTime}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
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

              {post.coverImage && (
                <div className="relative aspect-video mb-12 rounded-xl overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
              {/* Blog Content */}
              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary-teal hover:prose-a:text-primary-teal/80 prose-img:rounded-xl blog-content"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>

            {/* Table of Contents Sidebar */}
            {tocItems.length > 0 && (
              <div className="hidden lg:block">
                <div className="sticky top-20">
                  <TableOfContents
                    items={tocItems}
                    activeId={activeHeading}
                    onItemClick={scrollToHeading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation and Related Posts */}
          <div className="mt-16 space-y-16">
            {/* Previous/Next Navigation */}
            {(adjacentPosts?.prev || adjacentPosts?.next) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {adjacentPosts?.prev && (
                  <Card
                    className="group cursor-pointer p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5"
                    onClick={() => navigate(`/blog/${adjacentPosts.prev.slug}`)}
                  >
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      Previous Post
                    </p>
                    <h4 className="font-medium group-hover:text-primary-teal transition-colors">
                      {adjacentPosts.prev.title}
                    </h4>
                  </Card>
                )}
                {adjacentPosts?.next && (
                  <Card
                    className="group cursor-pointer p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-teal/5"
                    onClick={() => navigate(`/blog/${adjacentPosts.next.slug}`)}
                  >
                    <p className="text-sm text-muted-foreground mb-2 flex items-center justify-end gap-1">
                      Next Post
                      <ArrowRight className="h-4 w-4" />
                    </p>
                    <h4 className="font-medium text-right group-hover:text-primary-teal transition-colors">
                      {adjacentPosts.next.title}
                    </h4>
                  </Card>
                )}
              </motion.div>
            )}

            {/* View More Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex justify-center"
            >
              <Link
                to="/archive"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary-teal transition-colors"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                View more posts
              </Link>
            </motion.div>

            {/* Related Posts Section */}
            <RelatedPosts posts={relatedPosts || []} />
          </div>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
};
