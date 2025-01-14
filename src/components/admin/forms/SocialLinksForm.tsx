import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SocialLinksFormProps {
  initialData?: any;
  onClose: () => void;
}

export const SocialLinksForm = ({ initialData, onClose }: SocialLinksFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
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
            <p className="text-sm text-red-500">{errors.platform.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            {...register("url", { required: "URL is required" })}
          />
          {errors.url && (
            <p className="text-sm text-red-500">{errors.url.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="icon_key">Icon Key</Label>
          <Input
            id="icon_key"
            {...register("icon_key", { required: "Icon key is required" })}
          />
          {errors.icon_key && (
            <p className="text-sm text-red-500">{errors.icon_key.message}</p>
          )}
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