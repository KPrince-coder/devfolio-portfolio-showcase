import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageListItem } from "../messages/MessageListItem";
import { MessageDetailsDialog } from "../messages/MessageDetailsDialog";
import { MessageReplyDialog } from "../messages/MessageReplyDialog";
import { MessageSearchFilter } from "../messages/MessageSearchFilter";
import { AdvancedMessageFilter } from "../messages/AdvancedMessageFilter";
import {
  MessageSkeleton,
  MessageSkeletonList,
} from "../skeletons/MessageSkeleton";
import { EmptyMessageState } from "../messages/EmptyMessageState";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ContactSubmission, MessageFilterStatus } from "@/types/messages";

export const MessageManager = () => {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<ContactSubmission | null>(null);
  const [replyToMessage, setReplyToMessage] =
    useState<ContactSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<MessageFilterStatus>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const { toast } = useToast();

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("contact_submissions")
        .select("*", { count: "exact" });

      // Apply filters
      if (filterStatus !== "all") {
        query = query.eq("is_read", filterStatus === "read");
      }

      if (searchTerm) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`
        );
      }

      // Apply sorting
      query = query.order("created_at", { ascending: sortOrder === "asc" });

      // Apply pagination
      const start = (pagination.currentPage - 1) * pagination.pageSize;
      const end = start + pagination.pageSize - 1;
      query = query.range(start, end);

      const { data, error, count } = await query;

      if (error) throw error;

      setMessages((data as ContactSubmission[]) || []);
      setPagination((prev) => ({
        ...prev,
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / pagination.pageSize),
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [
    searchTerm,
    filterStatus,
    sortOrder,
    pagination.currentPage,
    pagination.pageSize,
  ]);

  const handleToggleMessageRead = async (message: ContactSubmission) => {
    try {
      const newReadStatus = !message.is_read;
      const { error } = await supabase
        .from("contact_submissions")
        .update({
          is_read: newReadStatus,
          read_at: newReadStatus ? new Date().toISOString() : null,
        })
        .eq("id", message.id);

      if (error) throw error;

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id
            ? {
                ...msg,
                is_read: newReadStatus,
                read_at: newReadStatus ? new Date().toISOString() : null,
              }
            : msg
        )
      );

      toast({
        title: "Success",
        description: `Message marked as ${newReadStatus ? "read" : "unread"}`,
      });
    } catch (error) {
      console.error("Error updating message status:", error);
      toast({
        title: "Error",
        description: "Failed to update message status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewMessage = async (message: ContactSubmission) => {
    setSelectedMessage(message);

    // If message is unread, mark it as read
    if (!message.is_read) {
      await handleToggleMessageRead(message);
    }
  };

  const handleDeleteMessage = async (message: ContactSubmission) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", message.id);

      if (error) throw error;

      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
      setSelectedMessages((prev) => {
        const next = new Set(prev);
        next.delete(message.id);
        return next;
      });

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .in("id", Array.from(selectedMessages));

      if (error) throw error;

      await fetchMessages();
      setSelectedMessages(new Set());

      toast({
        title: "Success",
        description: "Selected messages deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting messages:", error);
      toast({
        title: "Error",
        description: "Failed to delete messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
        <MessageSearchFilter
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          sortOrder={sortOrder}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterStatus}
          onSortToggle={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          onRefresh={fetchMessages}
          pagination={pagination}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, currentPage: page }))
          }
        />

        <AdvancedMessageFilter
          onFilterApply={(filters) => {
            // Implement advanced filtering logic
          }}
          onFilterReset={() => {
            setSearchTerm("");
            setFilterStatus("all");
            setSortOrder("desc");
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
          }}
        />
      </div>

      {selectedMessages.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center justify-between bg-muted/50 p-4 rounded-lg"
        >
          <p className="text-sm text-muted-foreground">
            {selectedMessages.size} message
            {selectedMessages.size !== 1 ? "s" : ""} selected
          </p>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </motion.div>
      )}

      {isLoading ? (
        <MessageSkeletonList />
      ) : messages.length === 0 ? (
        <EmptyMessageState onRefresh={fetchMessages} />
      ) : (
        <AnimatePresence>
          <motion.div className="space-y-4">
            {messages.map((message) => (
              <MessageListItem
                key={message.id}
                message={message}
                isSelected={selectedMessages.has(message.id)}
                onSelect={() =>
                  setSelectedMessages((prev) => {
                    const next = new Set(prev);
                    if (next.has(message.id)) {
                      next.delete(message.id);
                    } else {
                      next.add(message.id);
                    }
                    return next;
                  })
                }
                onView={() => handleViewMessage(message)}
                onDelete={() => handleDeleteMessage(message)}
                onReply={() => setReplyToMessage(message)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {selectedMessage && (
        <MessageDetailsDialog
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReply={() => {
            setReplyToMessage(selectedMessage);
            setSelectedMessage(null);
          }}
        />
      )}

      {replyToMessage && (
        <MessageReplyDialog
          message={replyToMessage}
          onClose={() => setReplyToMessage(null)}
        />
      )}
    </div>
  );
};
