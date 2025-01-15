import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactSubmission, MessageFilters } from '@/types/messages';
import { toast } from '@/components/ui/use-toast';

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

      // Status filtering
      if (filters.status === 'read') {
        query = query.eq('is_read', true);
      } else if (filters.status === 'unread') {
        query = query.eq('is_read', false);
      } else if (filters.status === 'replied') {
        query = query.eq('status', 'replied');
      }

      // Get total count first
      const { count } = await query;
      setTotalMessages(count || 0);

      // Calculate safe pagination values
      const totalPages = Math.ceil((count || 0) / filters.pageSize);
      const safePage = Math.min(filters.page, totalPages || 1);
      
      // Only apply pagination if there are results
      if (count && count > 0) {
        query = query
          .order('created_at', { ascending: filters.sortOrder === 'asc' })
          .range(
            (safePage - 1) * filters.pageSize,
            safePage * filters.pageSize - 1
          );
      }

      const { data, error } = await query;

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    }
  };

  // Memoized pagination data
  const pagination = useMemo(() => ({
    currentPage: filters.page,
    totalPages: Math.ceil(totalMessages / filters.pageSize),
    pageSize: filters.pageSize,
    totalMessages
  }), [totalMessages, filters.page, filters.pageSize]);

  const updateFilters = (newFilters: Partial<MessageFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  return {
    messages,
    filters,
    pagination,
    updateFilters,
    fetchMessages
  };
};