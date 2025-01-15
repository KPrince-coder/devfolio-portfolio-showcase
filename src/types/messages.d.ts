export interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  tags?: string[];
}

export interface MessageFilters {
  searchTerm: string;
  status: 'all' | 'read' | 'unread' | 'replied';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}