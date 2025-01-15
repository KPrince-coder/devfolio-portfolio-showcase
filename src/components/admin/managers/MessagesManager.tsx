import { useState } from 'react';
import { useMessageManager } from '@/hooks/use-message-manager';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const MessagesManager = () => {
  const { messages, filters, pagination, updateFilters } = useMessageManager();
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const { toast } = useToast();

  const handleDeleteMessages = async (messageIds: number[]) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .in('id', messageIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${messageIds.length} message(s) deleted successfully`
      });
      
      setSelectedMessages([]);
    } catch (error) {
      console.error('Error deleting messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete messages"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center mb-4 space-x-2">
          <Checkbox 
            checked={selectedMessages.length === messages.length}
            onCheckedChange={(checked) => {
              setSelectedMessages(
                checked 
                  ? messages.map(m => m.id)
                  : []
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
                <Card key={message.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedMessages.includes(message.id)}
                      onCheckedChange={(checked) => {
                        setSelectedMessages(
                          checked
                            ? [...selectedMessages, message.id]
                            : selectedMessages.filter(id => id !== message.id)
                        );
                      }}
                    />
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{message.full_name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                      <p className="mt-2">{message.message}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            No messages found
          </div>
        )}
      </Card>

      {selectedMessages.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="destructive"
            onClick={() => handleDeleteMessages(selectedMessages)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selectedMessages.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessagesManager;