import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Music, Camera, Book, Gamepad, Code, Palette, Dumbbell } from "lucide-react";

interface HobbiesFormProps {
  initialData?: {
    id: string;
    name: string;
    category: string;
    icon_key: string;
  };
  onClose: () => void;
}

const CATEGORIES = [
  "Arts & Crafts",
  "Music",
  "Photography",
  "Reading",
  "Gaming",
  "Technology",
  "Sports & Fitness",
  "Other"
];

const ICONS = [
  { key: "heart", icon: Heart, label: "Heart" },
  { key: "music", icon: Music, label: "Music" },
  { key: "camera", icon: Camera, label: "Camera" },
  { key: "book", icon: Book, label: "Book" },
  { key: "gamepad", icon: Gamepad, label: "Gaming" },
  { key: "code", icon: Code, label: "Technology" },
  { key: "palette", icon: Palette, label: "Art" },
  { key: "dumbbell", icon: Dumbbell, label: "Fitness" }
];

export const HobbiesForm = ({ initialData, onClose }: HobbiesFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    icon_key: initialData?.icon_key || "heart",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("hobbies")
          .update(formData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Hobby updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("hobbies")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Hobby added successfully",
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving hobby:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save hobby",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Icon</label>
          <Select
            value={formData.icon_key}
            onValueChange={(value) => setFormData({ ...formData, icon_key: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {ICONS.map(({ key, icon: Icon, label }) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Card>
  );
};