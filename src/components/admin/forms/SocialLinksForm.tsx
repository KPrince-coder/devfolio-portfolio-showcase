import { useState } from "react";
import { useForm } from "react-hook-form";
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
import * as Icons from "lucide-react";

interface SocialLinksFormProps {
  initialData?: any;
  onClose: () => void;
}

// Define available social media platforms and their corresponding icons
const SOCIAL_PLATFORMS = [
  { value: "github", label: "GitHub", icon: "Github" },
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { value: "twitter", label: "Twitter", icon: "Twitter" },
  { value: "facebook", label: "Facebook", icon: "Facebook" },
  { value: "instagram", label: "Instagram", icon: "Instagram" },
  { value: "youtube", label: "YouTube", icon: "Youtube" },
  { value: "mail", label: "Email", icon: "Mail" },
  { value: "link", label: "Generic Link", icon: "Link" },
];

export const SocialLinksForm = ({ initialData, onClose }: SocialLinksFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      platform: initialData?.platform || "",
      url: initialData?.url || "",
      icon_key: initialData?.icon_key || "link",
      is_active: initialData?.is_active ?? true,
    },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="platform">Platform Name</Label>
          <Input
            id="platform"
            {...register("platform", { required: "Platform name is required" })}
          />
          {errors.platform && (
            <p className="text-sm text-destructive">{errors.platform.message?.toString()}</p>
          )}
        </div>

        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            {...register("url", { 
              required: "URL is required",
              pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: "Please enter a valid URL"
              }
            })}
          />
          {errors.url && (
            <p className="text-sm text-destructive">{errors.url.message?.toString()}</p>
          )}
        </div>

        <div>
          <Label>Icon</Label>
          <Select
            value={watch("icon_key")}
            onValueChange={(value) => setValue("icon_key", value)}
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
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};