export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
  modifiedAt?: string;
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
