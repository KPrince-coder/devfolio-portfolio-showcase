export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tags: string[];
  demo_link?: string;
  github_link?: string;
  live_link?: string;
  created_at?: string;
  updated_at?: string;
  long_description?: string;
  technologies: string[];
  type: "all" | "web" | "android" | "data";
  features: string[];
}