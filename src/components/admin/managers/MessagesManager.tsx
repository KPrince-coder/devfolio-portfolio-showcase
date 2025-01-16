import { useMessageManager } from "@/hooks/useMessageManager";
import { useState } from "react";
import { ContactSubmission } from '@/types/messages';
import { MessageSearchFilter } from "../messages/MessageSearchFilter";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { MessageListItem } from "../messages/MessageListItem";
import { Button } from "@/components/ui/button";
import { MessageReplyDialog } from "../messages/MessageReplyDialog";
import { MessageDetailsDialog } from "../messages/MessageDetailsDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';

// Utility function for deleting messages
const deleteMessages = async (messageIds: number[]) => {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .in('id', messageIds);

    if (error) throw error;

    toast({
      title: "Messages Deleted",
      description: `${messageIds.length} message(s) deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting messages:', error);
    toast({
      title: "Error",
      description: "Failed to delete messages",
      variant: "destructive"
    });
  }
};

export const MessagesManager: React.FC = () => {
  const { 
    messages, 
    filters, 
    pagination, 
    updateFilters 
  } = useMessageManager();
  
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  const handleSearchChange = (term: string) => {
    updateFilters({ searchTerm: term, page: 1 });
  };

  const handleFilterStatusChange = (status: 'all' | 'read' | 'unread') => {
    updateFilters({ status, page: 1 });
  };

  const handleSortToggle = () => {
    updateFilters({ 
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const markMessagesAsRead = async (messageIds: number[]) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'read' as const })
        .in('id', messageIds);

      if (error) throw error;

      toast({
        title: "Messages Marked",
        description: `${messageIds.length} message(s) marked as read`,
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark messages as read",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <MessageSearchFilter 
        searchTerm={filters.searchTerm}
        filterStatus={filters.status}
        sortOrder={filters.sortOrder}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterStatusChange}
        onSortToggle={handleSortToggle}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <Card className="p-6">
        <div className="flex items-center mb-4 space-x-2">
          <Checkbox 
            checked={selectedMessages.length === messages.length}
            onCheckedChange={() => {
              setSelectedMessages(
                selectedMessages.length === messages.length 
                  ? [] 
                  : messages.map(m => m.id)
              );
            }}
          />
          <h2 className="text-2xl font-semibold">
            Contact Messages ({pagination.totalMessages})
          </h2>
        </div>
        
        {messages.length > 0 ? (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageListItem 
                  key={message.id}
                  message={message}
                  isSelected={selectedMessages.includes(message.id)}
                  onSelect={() => {
                    const newSelectedMessages = selectedMessages.includes(message.id)
                      ? selectedMessages.filter(id => id !== message.id)
                      : [...selectedMessages, message.id];
                    setSelectedMessages(newSelectedMessages);
                  }}
                  onView={() => {
                    setSelectedMessage(message);
                    if (!message.is_read) {
                      markMessagesAsRead([message.id]);
                    }
                  }}
                  onDelete={() => {
                    deleteMessages([message.id]);
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            No messages found
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="destructive" 
            onClick={() => {
              deleteMessages(selectedMessages);
              setSelectedMessages([]);
            }}
          >
            <Trash2 className="mr-2" /> Delete Selected ({selectedMessages.length})
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              markMessagesAsRead(selectedMessages);
              setSelectedMessages([]);
            }}
          >
            Mark as Read
          </Button>
        </div>
      )}

      {/* Message Details Dialog */}
      <MessageDetailsDialog 
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onReply={() => {
          setIsReplyDialogOpen(true);
        }}
      />

      {/* Message Reply Dialog */}
      {isReplyDialogOpen && (
        <MessageReplyDialog 
          message={selectedMessage}
          onClose={() => setIsReplyDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default MessagesManager;