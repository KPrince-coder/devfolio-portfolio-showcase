import React from 'react';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface MessageSearchFilterProps {
  searchTerm: string;
  filterStatus: 'all' | 'read' | 'unread';
  sortOrder: 'asc' | 'desc';
  onSearchChange: (term: string) => void;
  onFilterChange: (status: 'all' | 'read' | 'unread') => void;
  onSortToggle: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
}

export const MessageSearchFilter: React.FC<MessageSearchFilterProps> = ({
  searchTerm,
  filterStatus,
  sortOrder,
  onSearchChange,
  onFilterChange,
  onSortToggle,
  pagination,
  onPageChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select 
          value={filterStatus} 
          onValueChange={(val: 'all' | 'read' | 'unread') => onFilterChange(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="read">Read Messages</SelectItem>
            <SelectItem value="unread">Unread Messages</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={onSortToggle}
        >
          {sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
        </Button>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            disabled={pagination.currentPage === 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => onPageChange(pagination.currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};