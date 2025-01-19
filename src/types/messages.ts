export interface DateRange {
  from: Date;
  to: Date;
}

export type MessageStatus = 'new' | 'read' | 'unread' | 'replied' | 'archived';
export type MessageFilterStatus = 'all' | 'read' | 'unread' | 'replied';

export interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  read_at: string | null;
  status: MessageStatus;
  tags?: string[];
}

export interface MessageFilters {
  searchTerm: string;
  status: MessageFilterStatus;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  created_at: string;
  updated_at: string;
}