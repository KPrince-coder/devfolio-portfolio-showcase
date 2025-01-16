import React, { useState } from 'react';
import { Calendar, Filter, Tag, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DateRange } from '@/types/messages';

interface AdvancedFilterProps {
  onFilterApply: (filters: {
    dateRange: DateRange;
    tags?: string[];
    sender?: string;
    status?: 'all' | 'read' | 'unread' | 'replied';
  }) => void;
}

export const AdvancedMessageFilter: React.FC<AdvancedFilterProps> = ({ onFilterApply }) => {
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: new Date(), 
    to: new Date() 
  });
  const [tags, setTags] = useState<string[]>([]);
  const [sender, setSender] = useState('');
  const [status, setStatus] = useState<'all' | 'read' | 'unread' | 'replied'>('all');

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from
      });
    }
  };

  const handleApplyFilters = () => {
    onFilterApply({
      dateRange,
      tags,
      sender,
      status
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Advanced Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <div>
          <h4 className="mb-2 flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Date Range
          </h4>
          <CalendarComponent
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={handleDateRangeChange}
          />
        </div>

        <div>
          <h4 className="mb-2 flex items-center">
            <Tag className="mr-2 h-4 w-4" /> Tags
          </h4>
          <div className="flex space-x-2">
            <Input 
              placeholder="Add tag"
              value={tags.join(', ')}
              onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
            />
          </div>
        </div>

        <div>
          <h4 className="mb-2 flex items-center">
            <User className="mr-2 h-4 w-4" /> Sender
          </h4>
          <Input 
            placeholder="Sender name or email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
        </div>

        <div>
          <h4 className="mb-2">Status</h4>
          <Select 
            value={status}
            onValueChange={(val: 'all' | 'read' | 'unread' | 'replied') => setStatus(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full" 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </PopoverContent>
    </Popover>
  );
};