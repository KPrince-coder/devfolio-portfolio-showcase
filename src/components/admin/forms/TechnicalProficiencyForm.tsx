import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

interface TechnicalProficiencyFormProps {
  initialData?: {
    id: string;
    skill: string;
    proficiency: number;
  };
  onClose: () => void;
}

export const TechnicalProficiencyForm = ({ initialData, onClose }: TechnicalProficiencyFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    skill: initialData?.skill || "",
    proficiency: initialData?.proficiency || 50,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("technical_proficiency")
          .update(formData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Technical proficiency updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("technical_proficiency")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Technical proficiency added successfully",
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving technical proficiency:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save technical proficiency",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Skill</label>
          <Input
            value={formData.skill}
            onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Proficiency: {formData.proficiency}%
          </label>
          <Slider
            value={[formData.proficiency]}
            onValueChange={(value) => setFormData({ ...formData, proficiency: value[0] })}
            max={100}
            step={1}
            className="py-4"
          />
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