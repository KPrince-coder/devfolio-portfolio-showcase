import React from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactSubmission } from "@/types/messages";
import { cn } from "@/lib/utils";

interface MessageListItemProps {
  message: ContactSubmission;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDelete: () => void;
}

export const MessageListItem: React.FC<MessageListItemProps> = ({
  message,
  isSelected,
  onSelect,
  onView,
  onDelete,
}) => {
  return (
    <Card
      className={cn(
        "p-4 flex items-center justify-between transition-colors",
        "bg-background/60 hover:bg-accent/50",
        "border border-border/50",
        !message.is_read && "bg-primary/5 dark:bg-primary/10",
        isSelected && "ring-2 ring-primary/50"
      )}
    >
      <div className="flex items-center space-x-4">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-foreground">{message.full_name}</h3>
            {!message.is_read && (
              <Badge
                variant="outline"
                className="bg-primary/20 text-primary border-primary/30"
              >
                New
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground/90">{message.email}</p>
          <p className="mt-2 text-sm text-foreground/90">{message.subject}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {new Date(message.created_at).toLocaleDateString()}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={onView}
          className="hover:bg-primary/10"
        >
          {message.is_read ? (
            <Eye className="text-muted-foreground" />
          ) : (
            <EyeOff className="text-primary" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="hover:bg-destructive/10"
        >
          <Trash2 className="text-destructive" />
        </Button>
      </div>
    </Card>
  );
};
