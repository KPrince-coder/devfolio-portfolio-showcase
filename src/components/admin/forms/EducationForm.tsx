import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface EducationFormProps {
  initialData?: {
    id: string;
    degree: string;
    institution: string;
    year_start: string;
    year_end: string | null;
    type: 'degree' | 'certification';
  };
  onClose: () => void;
}

export const EducationForm = ({ initialData, onClose }: EducationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    degree: initialData?.degree || "",
    institution: initialData?.institution || "",
    year_start: initialData?.year_start || "",
    year_end: initialData?.year_end || "",
    type: initialData?.type || "degree" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("education")
          .update(formData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Education entry updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("education")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Education entry added successfully",
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving education entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save education entry",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select
            value={formData.type}
            onValueChange={(value: 'degree' | 'certification') => 
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="degree">Degree</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {formData.type === 'degree' ? 'Degree' : 'Certification'} Name
          </label>
          <Input
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Institution</label>
          <Input
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Year</label>
            <Input
              type="text"
              value={formData.year_start}
              onChange={(e) => setFormData({ ...formData, year_start: e.target.value })}
              required
              placeholder="YYYY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Year</label>
            <Input
              type="text"
              value={formData.year_end}
              onChange={(e) => setFormData({ ...formData, year_end: e.target.value })}
              placeholder="YYYY (or leave empty for ongoing)"
            />
          </div>
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