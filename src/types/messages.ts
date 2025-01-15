export interface ContactSubmission {
    id: number;
    full_name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    status: 'new' | 'read' | 'replied' | 'archived';
    created_at: string;
  }
  
  export interface MessageFilters {
    searchTerm: string;
    status: 'all' | 'read' | 'unread' | 'replied';
    sortOrder: 'asc' | 'desc';
    page: number;
    pageSize: number;
  }