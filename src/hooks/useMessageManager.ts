import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactSubmission, MessageFilters } from '@/types/messages';

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

  // Fetch Messages with Advanced Filtering
  const fetchMessages = async () => {
    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' });

    // Apply Filters
    if (filters.searchTerm) {
      query = query.or(
        `full_name.ilike.%${filters.searchTerm}%,` +
        `email.ilike.%${filters.searchTerm}%,` +
        `subject.ilike.%${filters.searchTerm}%,` +
        `message.ilike.%${filters.searchTerm}%`
      );
    }

    // Status Filtering
    if (filters.status !== 'all') {
      query = query.eq('is_read', filters.status === 'read');
    }

    // Pagination
    query = query
      .order('created_at', { ascending: filters.sortOrder === 'asc' })
      .range(
        (filters.page - 1) * filters.pageSize, 
        filters.page * filters.pageSize - 1
      );

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
    setTotalMessages(count || 0);
  };

  // Memoized Derived State
  const pagination = useMemo(() => ({
    currentPage: filters.page,
    totalPages: Math.ceil(totalMessages / filters.pageSize),
    pageSize: filters.pageSize,
    totalMessages
  }), [totalMessages, filters]);

  // Update Filters
  const updateFilters = (newFilters: Partial<MessageFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Side Effects
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