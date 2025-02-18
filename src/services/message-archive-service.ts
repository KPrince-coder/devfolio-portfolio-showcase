import { supabase } from '@/integrations/supabase/client';
import { ContactSubmission } from '@/types/messages';

export class MessageArchiveService {
  static async archiveMessages(messageIds: number[]): Promise<void> {
    try {
      await supabase
        .from('contact_submissions')
        .update({ 
          status: 'archived' as const,
          updated_at: new Date().toISOString()
        })
        .in('id', messageIds);
    } catch (error) {
      console.error('Error archiving messages:', error);
      throw error;
    }
  }

  static async restoreArchivedMessages(messageIds: number[]): Promise<void> {
    try {
      await supabase
        .from('contact_submissions')
        .update({ 
          status: 'new' as const,
          updated_at: new Date().toISOString()
        })
        .in('id', messageIds);
    } catch (error) {
      console.error('Error restoring messages:', error);
      throw error;
    }
  }

  static async getArchivedMessages(
    page = 1, 
    pageSize = 10
  ): Promise<{
    messages: ContactSubmission[];
    total: number;
  }> {
    const { data, count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .eq('status', 'archived')
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('updated_at', { ascending: false });

    return {
      messages: (data || []).map(msg => ({
        ...msg,
        status: msg.status as ContactSubmission['status']
      })),
      total: count || 0
    };
  }
}