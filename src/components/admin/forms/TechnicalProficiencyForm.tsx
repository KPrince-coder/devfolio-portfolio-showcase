import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Loader2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechnicalProficiencyFormProps {
  initialData?: {
    id: string;
    skill: string;
    proficiency: number;
  };
  onClose: () => void;
}

interface ValidationErrors {
  skill?: string;
}

const getProficiencyLevel = (value: number): string => {
  if (value >= 90) return "Expert";
  if (value >= 70) return "Advanced";
  if (value >= 50) return "Intermediate";
  if (value >= 30) return "Basic";
  return "Beginner";
};

const getProficiencyColor = (value: number): string => {
  if (value >= 90) return "text-green-500";
  if (value >= 70) return "text-blue-500";
  if (value >= 50) return "text-yellow-500";
  if (value >= 30) return "text-orange-500";
  return "text-red-500";
};

export const TechnicalProficiencyForm = ({ initialData, onClose }: TechnicalProficiencyFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    skill: initialData?.skill || "",
    proficiency: initialData?.proficiency || 50,
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.skill.trim()) {
      newErrors.skill = "Skill name is required";
      isValid = false;
    } else if (formData.skill.length < 2) {
      newErrors.skill = "Skill name must be at least 2 characters";
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="skill" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Skill
            </Label>
            <Input
              id="skill"
              value={formData.skill}
              onChange={(e) => {
                setFormData({ ...formData, skill: e.target.value });
                if (errors.skill) {
                  setErrors(prev => ({ ...prev, skill: undefined }));
                }
              }}
              className={cn(errors.skill && "border-red-500")}
              placeholder="e.g., React, Python, AWS"
            />
            <AnimatePresence>
              {errors.skill && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.skill}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Proficiency</Label>
              <span className={cn(
                "text-sm font-medium",
                getProficiencyColor(formData.proficiency)
              )}>
                {getProficiencyLevel(formData.proficiency)}
              </span>
            </div>
            
            <Slider
              value={[formData.proficiency]}
              onValueChange={(value) => setFormData({ ...formData, proficiency: value[0] })}
              max={100}
              step={1}
              className="py-4"
            />
            
            <Progress 
              value={formData.proficiency} 
              className="h-2"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-muted rounded-lg"
          >
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <div className="p-3 bg-background rounded border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{formData.skill || "Skill Name"}</span>
                <span className={cn(
                  "text-sm font-medium",
                  getProficiencyColor(formData.proficiency)
                )}>
                  {formData.proficiency}%
                </span>
              </div>
              <Progress 
                value={formData.proficiency} 
                className={cn(
                  "h-2",
                  formData.proficiency >= 90 && "bg-green-100",
                  formData.proficiency >= 70 && formData.proficiency < 90 && "bg-blue-100",
                  formData.proficiency >= 50 && formData.proficiency < 70 && "bg-yellow-100",
                  formData.proficiency >= 30 && formData.proficiency < 50 && "bg-orange-100",
                  formData.proficiency < 30 && "bg-red-100"
                )}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
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