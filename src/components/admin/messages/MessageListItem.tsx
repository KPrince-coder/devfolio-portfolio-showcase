import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Mail, Trash2, Reply, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ContactSubmission } from '@/types/messages';

interface MessageListItemProps {
  message: ContactSubmission;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDelete: () => void;
  onReply: () => void;
  onToggleRead?: () => void;
}

export const MessageListItem: React.FC<MessageListItemProps> = ({
  message,
  isSelected,
  onSelect,
  onView,
  onDelete,
  onReply,
  onToggleRead
}) => {
  const formattedDate = format(new Date(message.created_at), 'MMM dd, yyyy HH:mm');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "group relative flex items-center gap-4 rounded-lg border p-4 transition-colors",
        message.is_read ? "bg-background" : "bg-muted/30",
        isSelected && "border-primary"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="translate-y-[2px]"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              "text-sm font-medium truncate",
              !message.is_read && "font-semibold"
            )}>
              {message.full_name}
            </h4>
            {!message.is_read && (
              <Badge variant="default" className="h-1.5 w-1.5 rounded-full p-0" />
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">{message.email}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/25" />
            <span className="shrink-0">{formattedDate}</span>
          </div>

          <p className={cn(
            "mt-1 text-sm text-muted-foreground line-clamp-1",
            !message.is_read && "text-foreground"
          )}>
            {message.subject}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <TooltipProvider>
          {onToggleRead && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRead();
                  }}
                  className="h-8 w-8"
                >
                  {message.is_read ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as {message.is_read ? 'unread' : 'read'}</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className="h-8 w-8"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View message</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onReply();
                }}
                className="h-8 w-8"
              >
                <Reply className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reply to message</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};
