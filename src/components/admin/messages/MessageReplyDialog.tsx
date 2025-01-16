import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ContactSubmission } from "@/types/messages";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        <DialogHeader>
          <DialogTitle>Reply to {message.full_name}</DialogTitle>
          <DialogDescription>
            Replying to message: {message.subject}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={`Re: ${message.subject}`}
            readOnly
            className="bg-gray-100"
          />

          <Textarea
            placeholder="Write your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="min-h-[200px]"
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              disabled={!replyMessage.trim() || isSending}
            >
              {isSending ? "Sending..." : "Send Reply"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
