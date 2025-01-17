export interface Project {
  id: string;
  title: string;
  description: string | null;
  long_description?: string;
  image_url: string | null;
  category: string;
  tags: string[] | null;
  technologies: string[];
  type: string;
  features: string[];
  demo_link: string | null;
  github_link: string | null;
  live_link: string | null;
  created_at: string | null;
  updated_at: string | null;
}