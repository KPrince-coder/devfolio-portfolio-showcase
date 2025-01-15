import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Trash2 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ContactSubmission } from '@/types/messages';

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
  onDelete
}) => {
  return (
    <Card 
      className={`
        p-4 flex items-center justify-between 
        ${!message.is_read ? 'bg-blue-50 border-blue-200' : ''}
        hover:bg-gray-100 transition-colors
      `}
    >
      <div className="flex items-center space-x-4">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={onSelect}
        />
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{message.full_name}</h3>
            {!message.is_read && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                New
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {message.email}
          </p>
          <p className="mt-2 text-sm">{message.subject}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          {new Date(message.created_at).toLocaleDateString()}
        </span>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onView}
        >
          {message.is_read ? <Eye /> : <EyeOff />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onDelete}
        >
          <Trash2 className="text-red-500" />
        </Button>
      </div>
    </Card>
  );
};