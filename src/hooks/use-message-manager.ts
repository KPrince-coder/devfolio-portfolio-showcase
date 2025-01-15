import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface MessageFilters {
  searchTerm: string;
  status: 'all' | 'read' | 'unread';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const useMessageManager = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [filters, setFilters] = useState<MessageFilters>({
    searchTerm: '',
    status: 'all',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
  });
  const [totalMessages, setTotalMessages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages with filters:', filters);
      
      let query = supabase
        .from('contact_submissions')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.searchTerm) {
        query = query.or(
          `full_name.ilike.%${filters.searchTerm}%,` +
          `email.ilike.%${filters.searchTerm}%,` +
          `subject.ilike.%${filters.searchTerm}%,` +
          `message.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters.status !== 'all') {
        query = query.eq('is_read', filters.status === 'read');
      }

      // Apply sorting and pagination
      const { data, count, error } = await query
        .order('created_at', { ascending: filters.sortOrder === 'asc' })
        .range(
          (filters.page - 1) * filters.pageSize,
          filters.page * filters.pageSize - 1
        );

      if (error) {
        throw error;
      }

      console.log('Fetched messages:', data);
      setMessages(data || []);
      setTotalMessages(count || 0);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch messages"
      });
    }
  };

  const updateFilters = (newFilters: Partial<MessageFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const pagination = {
    currentPage: filters.page,
    totalPages: Math.ceil(totalMessages / filters.pageSize),
    pageSize: filters.pageSize,
    totalMessages
  };

  return {
    messages,
    filters,
    pagination,
    updateFilters,
    fetchMessages
  };
};