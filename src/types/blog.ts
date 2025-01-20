// Database types from Supabase - exact column names from backend
export interface BlogPostDatabase {
  // Visible in image
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  author: string;
  tags: string[];
  slug: string;
  viewcount: number;
  hasliked: boolean;
  like_count: number;
  comment_count: number;
  reading_time: number;
  category: string;
  status: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  coverimage: string;

  // Required fields that might not be visible
  id: string;
}

// Application interface with camelCase naming
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  slug: string;
  viewCount: number;
  hasLiked: boolean;
  likeCount: number;
  commentCount: number;
  readingTime: number;
  category: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  coverImage: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Form values type for blog creation/editing
export interface BlogFormValues {
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  tags: string[];
  slug: string;
  category: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  coverImage: string;
  author: string;
}

// Response type for blog posts
export interface BlogPostResponse {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  slug: string;
  viewCount: number;
  likeCount: number;
  hasLiked: boolean;
  commentCount: number;
  readingTime: number;
  category: string;
  status: "draft" | "published";
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
}
