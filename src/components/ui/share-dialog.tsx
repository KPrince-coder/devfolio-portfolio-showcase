import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share, Link, Twitter, Facebook, Linkedin } from "lucide-react";
import { shareContent, SharePlatform } from "@/utils/share";
import { useState } from "react";
import { toast } from "sonner";

interface ShareDialogProps {
  url: string;
  title: string;
}

export function ShareDialog({ url, title }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async (platform: SharePlatform) => {
    await shareContent(url, title, platform, () => {
      if (platform === 'copy') {
        setIsCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      }
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Share className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this post</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleShare('copy')}
          >
            <Link className="mr-2 h-4 w-4" />
            {isCopied ? "Copied!" : "Copy link"}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
