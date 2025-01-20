// export interface BlogPost {
//   id: string;
//   slug: string;
//   title: string;
//   excerpt: string;
//   content: string;
//   coverImage: string;
//   author: string;
//   publishedAt: string;
//   tags: string[];
//   modifiedAt?: string;
// }

export interface BlogPost {
  id: string;
  title: string;

  slug: string;

  excerpt: string;

  content: string;

  coverImage: string;

  tags: string[];

  status: "draft" | "published";

  is_featured: boolean;

  meta_title?: string;

  meta_description?: string;

  meta_keywords?: string;

  created_at: string;

  modifiedAt?: string;
  publishedAt: string;

  comment_count: number;
  author: string;
  canonical_url?: string;
}

export interface BlogPostResponse {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverimage?: string;
  image_url?: string;
  author?: string;
  publishedat?: string;
  created_at: string;
  tags?: string[];
  published: boolean;
}
