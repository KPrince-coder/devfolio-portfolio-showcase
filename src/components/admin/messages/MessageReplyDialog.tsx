import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ContactSubmission } from "@/types/messages";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Reply, Send, Loader2, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageReplyDialogProps {
  message: ContactSubmission | null;
  onClose: () => void;
}

export const MessageReplyDialog: React.FC<MessageReplyDialogProps> = ({
  message,
  onClose,
}) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendReply = async () => {
    if (!message || !replyMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Send email reply
      const { data, error: functionError } = await supabase.functions.invoke(
        "send-email",
        {
          body: {
            type: "reply",
            to: message.email,
            subject: `Re: ${message.subject}`,
            replyMessage: replyMessage.trim(),
            originalMessage: {
              message: message.message,
              subject: message.subject,
            },
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to send email");
      }

      // Update message status only if email was sent successfully
      const { error: updateError } = await supabase
        .from("contact_submissions")
        .update({
          status: "replied",
          replied_at: new Date().toISOString(),
          reply_message: replyMessage.trim(),
        })
        .eq("id", message.id);

      if (updateError) {
        throw new Error("Failed to update message status");
      }

      toast({
        title: "Success",
        description: "Your reply has been sent successfully",
      });

      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!message) return null;

  return (
    <Dialog open={!!message} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Reply className="w-5 h-5 text-primary" />
              Compose Reply
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            Replying to message from {message.full_name}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Original Message</Label>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>From: {message.full_name} ({message.email})</span>
              </div>
              <p className="text-sm font-medium">Subject: {message.subject}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Reply</Label>
            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              className="min-h-[200px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              disabled={!replyMessage.trim() || isSending}
              className="gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
