export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  start_date: string;
  end_date?: string | null;
  current: boolean;
  description: string;
  company_url?: string;
  achievements: string[];
  skills: string[];
  created_at?: string;
  updated_at?: string;
}
