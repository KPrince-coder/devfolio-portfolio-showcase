import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ContactSubmission } from '@/types/messages';
import { sendReplyEmail } from '@/lib/email-service';
import { useToast } from '@/components/ui/use-toast';

interface MessageReplyDialogProps {
  message: ContactSubmission | null;
  onClose: () => void;
}

export const MessageReplyDialog: React.FC<MessageReplyDialogProps> = ({
  message,
  onClose
}) => {
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();

  const handleSendReply = async () => {
    if (!message || !replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendReplyEmail({
        to: message.email,
        subject: `Re: ${message.subject}`,
        replyText: replyMessage,
        originalMessage: message
      });

      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully",
        variant: "default"
      });

      // Update message status in database
      await updateMessageStatus(message.id, 'replied');

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive"
      });
    }
  };

  if (!message) return null;

  return (
    <Dialog open={!!message} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to {message.full_name}</DialogTitle>
          <DialogDescription>
            Replying to message: {message.subject}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input 
            value={`Re: ${message.subject}`}
            readOnly
            className="bg-gray-100"
          />
          
          <Textarea 
            placeholder="Write your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="min-h-[200px]"
          />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply}
              disabled={!replyMessage.trim()}
            >
              Send Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};