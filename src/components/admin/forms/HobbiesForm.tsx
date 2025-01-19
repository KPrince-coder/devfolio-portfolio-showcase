import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Music, Camera, Book, Gamepad, Code, Palette, Dumbbell, AlertCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface HobbiesFormProps {
  initialData?: {
    id: string;
    name: string;
    category: string;
    icon_key: string;
  };
  onClose: () => void;
}

interface ValidationErrors {
  name?: string;
  category?: string;
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    icon_key: initialData?.icon_key || "heart",
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Hobby name is required";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form",
      });
      return;
    }

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

  const SelectedIcon = ICONS.find(icon => icon.key === formData.icon_key)?.icon || Heart;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: undefined }));
                }
              }}
              className={cn(errors.name && "border-red-500")}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({ ...formData, category: value });
                if (errors.category) {
                  setErrors(prev => ({ ...prev, category: undefined }));
                }
              }}
            >
              <SelectTrigger className={cn(errors.category && "border-red-500")}>
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
            {errors.category && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.category}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium">Icon</Label>
            <Select
              value={formData.icon_key}
              onValueChange={(value) => setFormData({ ...formData, icon_key: value })}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <SelectedIcon className="h-4 w-4" />
                    <span>{ICONS.find(icon => icon.key === formData.icon_key)?.label}</span>
                  </div>
                </SelectValue>
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-muted rounded-lg mb-4"
            >
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="flex items-center gap-3 p-3 bg-background rounded border">
                <SelectedIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{formData.name || "Hobby Name"}</p>
                  <p className="text-sm text-muted-foreground">{formData.category || "Category"}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end gap-2 pt-2"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Adding..."}
                </>
              ) : (
                initialData ? "Update" : "Add"
              )}
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
};