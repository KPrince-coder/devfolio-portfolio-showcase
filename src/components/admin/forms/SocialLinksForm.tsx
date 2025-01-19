import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLinksFormProps {
  initialData?: any;
  onClose: () => void;
}

// Define available social media platforms and their corresponding icons
const SOCIAL_PLATFORMS = [
  { value: "github", label: "GitHub", icon: "Github", pattern: "https://github.com/*" },
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin", pattern: "https://www.linkedin.com/in/*" },
  { value: "twitter", label: "Twitter", icon: "Twitter", pattern: "https://twitter.com/*" },
  { value: "facebook", label: "Facebook", icon: "Facebook", pattern: "https://www.facebook.com/*" },
  { value: "instagram", label: "Instagram", icon: "Instagram", pattern: "https://www.instagram.com/*" },
  { value: "youtube", label: "YouTube", icon: "Youtube", pattern: "https://www.youtube.com/*" },
  { value: "mail", label: "Email", icon: "Mail", pattern: "mailto:*" },
  { value: "link", label: "Generic Link", icon: "Link", pattern: "https://*" },
];

export const SocialLinksForm = ({ initialData, onClose }: SocialLinksFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm({
    defaultValues: {
      platform: initialData?.platform || "",
      url: initialData?.url || "",
      icon_key: initialData?.icon_key || "link",
      is_active: initialData?.is_active ?? true,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const { error } = initialData
        ? await supabase
            .from("social_links")
            .update(data)
            .eq("id", initialData.id)
        : await supabase.from("social_links").insert([data]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Social link ${initialData ? "updated" : "created"} successfully`,
      });

      onClose();
    } catch (error) {
      console.error("Error saving social link:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} social link`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.value === watch("icon_key"));
  const IconComponent = selectedPlatform ? (Icons as any)[selectedPlatform.icon] : Icons.Link;

  const validateUrl = (url: string) => {
    if (!url) return "URL is required";
    
    const platform = SOCIAL_PLATFORMS.find(p => p.value === watch("icon_key"));
    if (!platform) return true;

    const pattern = platform.pattern.replace("*", ".*");
    const regex = new RegExp(`^${pattern}$`);

    if (platform.value === "mail") {
      const emailRegex = /^mailto:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(url) || `Please enter a valid email address with mailto: prefix`;
    }

    return regex.test(url) || `URL should match the pattern: ${platform.pattern}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="platform">Platform Name</Label>
              <Input
                id="platform"
                className={cn(errors.platform && "border-red-500")}
                {...register("platform", { 
                  required: "Platform name is required",
                  minLength: {
                    value: 2,
                    message: "Platform name must be at least 2 characters"
                  }
                })}
              />
              <AnimatePresence>
                {errors.platform && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.platform.message?.toString()}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                className={cn(errors.url && "border-red-500")}
                {...register("url", { 
                  required: "URL is required",
                  validate: validateUrl
                })}
                onChange={(e) => {
                  register("url").onChange(e);
                  trigger("url");
                }}
              />
              <AnimatePresence>
                {errors.url && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.url.message?.toString()}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <Select
                value={watch("icon_key")}
                onValueChange={(value) => {
                  setValue("icon_key", value);
                  trigger("url");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an icon">
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      <span>{selectedPlatform?.label || "Select an icon"}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const PlatformIcon = (Icons as any)[platform.icon];
                    return (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <PlatformIcon className="h-4 w-4" />
                          <span>{platform.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-muted rounded-lg"
            >
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="flex items-center gap-3 p-3 bg-background rounded border">
                <IconComponent className={cn(
                  "h-5 w-5",
                  watch("is_active") ? "text-primary" : "text-muted-foreground"
                )} />
                <div className={cn(
                  "flex-1",
                  !watch("is_active") && "text-muted-foreground"
                )}>
                  <p className="font-medium">{watch("platform") || "Platform Name"}</p>
                  <p className="text-sm truncate">{watch("url") || "URL"}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end space-x-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : (
                initialData ? "Update" : "Create"
              )}
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
};