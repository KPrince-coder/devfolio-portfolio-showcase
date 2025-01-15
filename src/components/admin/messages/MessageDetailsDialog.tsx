import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContactSubmission } from '@/types/messages';

interface MessageDetailsDialogProps {
  message: ContactSubmission | null;
  onClose: () => void;
  onReply: () => void;
}

export const MessageDetailsDialog: React.FC<MessageDetailsDialogProps> = ({
  message,
  onClose,
  onReply
}) => {
  if (!message) return null;

  return (
    <Dialog open={!!message} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{message.subject}</DialogTitle>
          <DialogDescription>
            From: {message.full_name} ({message.email})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800">{message.message}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Received: {new Date(message.created_at).toLocaleString()}
            </p>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={onReply}>
                Reply
              </Button>
              <Button variant="destructive" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )};