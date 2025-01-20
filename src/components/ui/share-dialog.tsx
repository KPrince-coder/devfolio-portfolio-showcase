import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShareDialogProps {
  url: string;
  title: string;
}

export function ShareDialog({ url, title }: ShareDialogProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent hover:text-primary-teal"
        >
          <Share className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{title}"</DialogTitle>
          <DialogDescription>
            Copy the link below to share this post with others
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input
            value={url}
            readOnly
            className="flex-1"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button onClick={copyToClipboard} className="shrink-0">
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
