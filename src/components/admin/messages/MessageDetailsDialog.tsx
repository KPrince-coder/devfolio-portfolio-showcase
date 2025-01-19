import React from 'react';
import { format } from 'date-fns';
import { Mail, Reply, Trash2, X, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ContactSubmission } from '@/types/messages';

interface MessageDetailsDialogProps {
  message: ContactSubmission;
  onClose: () => void;
  onReply?: () => void;
  onDelete?: () => void;
  onToggleRead?: () => void;
}

export const MessageDetailsDialog: React.FC<MessageDetailsDialogProps> = ({
  message,
  onClose,
  onReply,
  onDelete,
  onToggleRead,
}) => {
  const formattedDate = format(new Date(message.created_at), 'PPpp');
  const formattedReadDate = message.read_at 
    ? format(new Date(message.read_at), 'PPpp')
    : null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Message Details</DialogTitle>
            <div className="flex items-center gap-2">
              {onToggleRead && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleRead}
                  className={cn(
                    "transition-colors",
                    message.is_read ? "text-muted-foreground" : "text-primary"
                  )}
                >
                  {message.is_read ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </Button>
              )}
              {onReply && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onReply}
                >
                  <Reply className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{message.full_name}</h3>
                <p className="text-sm text-muted-foreground">{message.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="text-sm">{formattedDate}</p>
              </div>
            </div>
            {message.is_read && formattedReadDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>Read on {formattedReadDate}</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Subject</h4>
            <p className="text-muted-foreground">{message.subject}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Message</h4>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="whitespace-pre-wrap">{message.message}</div>
            </ScrollArea>
          </div>

          {message.tags && message.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {message.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};