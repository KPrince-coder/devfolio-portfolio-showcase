import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  Reply
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { MessageFilterStatus } from '@/types/messages';

interface MessageSearchFilterProps {
  searchTerm: string;
  filterStatus: MessageFilterStatus;
  sortOrder: 'asc' | 'desc';
  onSearchChange: (term: string) => void;
  onFilterChange: (status: MessageFilterStatus) => void;
  onSortToggle: () => void;
  onRefresh?: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems?: number;
  };
  onPageChange: (page: number) => void;
  className?: string;
}

const statusIcons = {
  all: Mail,
  read: CheckCircle,
  unread: XCircle,
  replied: Reply,
};

const statusColors = {
  all: 'text-primary',
  read: 'text-green-500',
  unread: 'text-red-500',
  replied: 'text-blue-500',
};

export const MessageSearchFilter: React.FC<MessageSearchFilterProps> = ({
  searchTerm,
  filterStatus,
  sortOrder,
  onSearchChange,
  onFilterChange,
  onSortToggle,
  onRefresh,
  pagination,
  onPageChange,
  className
}) => {
  const StatusIcon = statusIcons[filterStatus];
  const currentRange = {
    start: (pagination.currentPage - 1) * pagination.pageSize + 1,
    end: Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems || 0),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select 
            value={filterStatus} 
            onValueChange={(val: MessageFilterStatus) => onFilterChange(val)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <StatusIcon className={cn("h-4 w-4", statusColors[filterStatus])} />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                All Messages
              </SelectItem>
              <SelectItem value="read" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Read Messages
              </SelectItem>
              <SelectItem value="unread" className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Unread Messages
              </SelectItem>
              <SelectItem value="replied" className="flex items-center gap-2">
                <Reply className="h-4 w-4 text-blue-500" />
                Replied Messages
              </SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={onSortToggle}
                  className="transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort by {sortOrder === 'asc' ? 'oldest' : 'newest'} first</p>
              </TooltipContent>
            </Tooltip>

            {onRefresh && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onRefresh}
                    className="transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh messages</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {pagination.totalItems ? (
            <span>
              Showing {currentRange.start}-{currentRange.end} of {pagination.totalItems} messages
            </span>
          ) : (
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1 px-2 text-sm">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === pagination.totalPages || 
                Math.abs(page - pagination.currentPage) <= 1
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
                    variant={pagination.currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={cn(
                      "h-8 w-8 p-0",
                      pagination.currentPage === page && "pointer-events-none"
                    )}
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className="h-8"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};