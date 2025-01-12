export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface BlogPostResponse {
  id: string;
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
