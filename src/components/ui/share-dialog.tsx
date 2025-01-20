import { Share, Link, Twitter, Facebook, Linkedin } from "lucide-react";
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
import { shareContent, SharePlatform } from "@/utils/share";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  url: string;
  title: string;
  className?: string;
}

interface ShareOptionProps {
  platform: SharePlatform;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const ShareOption = ({ platform, icon, label, onClick, className }: ShareOptionProps) => (
  <Button
    variant="outline"
    className={cn(
      "w-full justify-start gap-2 hover:text-primary-teal hover:border-primary-teal transition-colors",
      platform === 'whatsapp' && "text-green-500 hover:text-green-600 hover:border-green-500",
      className
    )}
    onClick={onClick}
  >
    {icon}
    {label}
  </Button>
);

// WhatsApp Icon Component
const WhatsAppIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="h-4 w-4 fill-current"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export function ShareDialog({ url, title, className }: ShareDialogProps) {
  const handleShare = async (platform: SharePlatform) => {
    await shareContent({
      url,
      text: title,
      platform,
      onSuccess: () => {
        if (platform === 'copy') {
          toast.success("Link copied to clipboard!");
        } else {
          toast.success(`Opening ${platform} share dialog...`);
        }
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("hover:bg-transparent hover:text-primary-teal", className)}
          aria-label="Share this post"
        >
          <Share className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{title}"</DialogTitle>
          <DialogDescription>
            Share this post with your network
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center space-x-2">
            <Input
              value={url}
              readOnly
              className="flex-1"
              onClick={(e) => e.currentTarget.select()}
              aria-label="Post URL"
            />
            <Button 
              onClick={() => handleShare('copy')}
              className="shrink-0"
              aria-label="Copy link to clipboard"
            >
              Copy Link
            </Button>
          </div>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Share on
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <ShareOption
              platform="whatsapp"
              icon={<WhatsAppIcon />}
              label="Share on WhatsApp"
              onClick={() => handleShare('whatsapp')}
            />
            <ShareOption
              platform="twitter"
              icon={<Twitter className="h-4 w-4" />}
              label="Share on Twitter"
              onClick={() => handleShare('twitter')}
            />
            <ShareOption
              platform="facebook"
              icon={<Facebook className="h-4 w-4" />}
              label="Share on Facebook"
              onClick={() => handleShare('facebook')}
            />
            <ShareOption
              platform="linkedin"
              icon={<Linkedin className="h-4 w-4" />}
              label="Share on LinkedIn"
              onClick={() => handleShare('linkedin')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
