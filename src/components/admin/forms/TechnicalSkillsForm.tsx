import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TechnicalSkillsFormProps {
  initialData?: {
    id: string;
    category: string;
    icon_key: string;
    skills: string[];
  };
  onClose: () => void;
}

export const TechnicalSkillsForm = ({ initialData, onClose }: TechnicalSkillsFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: initialData?.category || "",
    icon_key: initialData?.icon_key || "code",
    skills: initialData?.skills || [""],
  });

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("technical_skills")
          .update(formData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Technical skill updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("technical_skills")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Technical skill added successfully",
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving technical skill:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save technical skill",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
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
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="server">Server</SelectItem>
              <SelectItem value="smartphone">Smartphone</SelectItem>
              <SelectItem value="cloud">Cloud</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="shield">Shield</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                placeholder={`Skill ${index + 1}`}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeSkill(index)}
                disabled={formData.skills.length === 1}
              >
                <X className="h-4 w-4" />
              </Button>
              {index === formData.skills.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addSkill}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
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