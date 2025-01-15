import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface MessageTagManagerProps {
  messageId: number;
  existingTags: string[];
}

export const MessageTagManager: React.FC<MessageTagManagerProps> = ({ 
  messageId, 
  existingTags 
}) => {
  const [tags, setTags] = useState<string[]>(existingTags);
  const [newTag, setNewTag] = useState('');

  const addTag = async () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return;

    const updatedTags = [...tags, newTag.trim()];
    
    try {
      await supabase
        .from('contact_submissions')
        .update({ tags: updatedTags })
        .eq('id', messageId);

      setTags(updatedTags);
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const removeTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    
    try {
      await supabase
        .from('contact_submissions')
        .update({ tags: updatedTags })
        .eq('id', messageId);

      setTags(updatedTags);
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input 
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a tag"
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={addTag}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary"
            className="flex items-center"
          >
            {tag}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2 h-4 w-4"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};