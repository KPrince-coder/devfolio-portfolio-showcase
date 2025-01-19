import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface MessageTagManagerProps {
  messageId: number;
  existingTags: string[];
  onTagsUpdate?: (tags: string[]) => void;
  className?: string;
}

export const MessageTagManager: React.FC<MessageTagManagerProps> = ({ 
  messageId, 
  existingTags,
  onTagsUpdate,
  className
}) => {
  const [tags, setTags] = useState<string[]>(existingTags);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addTag = async () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (!trimmedTag || tags.includes(trimmedTag)) {
      if (!trimmedTag) {
        toast({
          title: "Error",
          description: "Please enter a tag",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "This tag already exists",
          variant: "destructive",
        });
      }
      return;
    }

    setIsLoading(true);
    const updatedTags = [...tags, trimmedTag];
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ tags: updatedTags })
        .eq('id', messageId);

      if (error) throw error;

      setTags(updatedTags);
      setNewTag('');
      onTagsUpdate?.(updatedTags);

      toast({
        title: "Success",
        description: "Tag added successfully",
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: "Error",
        description: "Failed to add tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeTag = async (tagToRemove: string) => {
    setIsLoading(true);
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ tags: updatedTags })
        .eq('id', messageId);

      if (error) throw error;

      setTags(updatedTags);
      onTagsUpdate?.(updatedTags);

      toast({
        title: "Success",
        description: "Tag removed successfully",
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: "Error",
        description: "Failed to remove tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a tag..."
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={addTag}
          disabled={!newTag.trim() || isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap gap-2"
          >
            {tags.map(tag => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge 
                  variant="secondary"
                  className="flex items-center gap-1 pr-1 hover:bg-secondary/80"
                >
                  <span>{tag}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};