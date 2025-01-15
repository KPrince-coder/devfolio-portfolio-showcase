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

interface SocialLinksFormProps {
  initialData?: any;
  onClose: () => void;
}

const SOCIAL_ICONS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "mail", label: "Email" },
  { value: "link", label: "Generic Link" },
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
            <p className="text-sm text-red-500">{errors.platform.message?.toString()}</p>
          )}
        </div>

        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            {...register("url", { required: "URL is required" })}
          />
          {errors.url && (
            <p className="text-sm text-red-500">{errors.url.message?.toString()}</p>
          )}
        </div>

        <div>
          <Label htmlFor="icon_key">Icon</Label>
          <Select
            value={watch("icon_key")}
            onValueChange={(value) => setValue("icon_key", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {SOCIAL_ICONS.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            {...register("is_active")}
            defaultChecked={initialData?.is_active ?? true}
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