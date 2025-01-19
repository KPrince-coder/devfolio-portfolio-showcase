import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

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

interface ValidationErrors {
  degree?: string;
  institution?: string;
  year_start?: string;
  year_end?: string;
}

export const EducationForm = ({ initialData, onClose }: EducationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    degree: initialData?.degree || "",
    institution: initialData?.institution || "",
    year_start: initialData?.year_start || "",
    year_end: initialData?.year_end || "",
    type: initialData?.type || "degree" as const,
  });

  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.year_start ? new Date(parseInt(initialData.year_start), 0) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.year_end ? new Date(parseInt(initialData.year_end), 0) : undefined
  );

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.degree.trim()) {
      newErrors.degree = `${formData.type === 'degree' ? 'Degree' : 'Certification'} name is required`;
      isValid = false;
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
      isValid = false;
    }

    if (!formData.year_start) {
      newErrors.year_start = 'Start year is required';
      isValid = false;
    }

    if (formData.year_start && formData.year_end) {
      const start = parseInt(formData.year_start);
      const end = parseInt(formData.year_end);
      if (end < start) {
        newErrors.year_end = 'End year must be after start year';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      setFormData({ ...formData, year_start: date.getFullYear().toString() });
      if (errors.year_start) {
        setErrors(prev => ({ ...prev, year_start: undefined }));
      }
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      setFormData({ ...formData, year_end: date.getFullYear().toString() });
      if (errors.year_end) {
        setErrors(prev => ({ ...prev, year_end: undefined }));
      }
    }
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
          >
            <Label className="text-sm font-medium mb-1">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'degree' | 'certification') => 
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="degree">Degree</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium">
              {formData.type === 'degree' ? 'Degree' : 'Certification'} Name
            </Label>
            <Input
              value={formData.degree}
              onChange={(e) => {
                setFormData({ ...formData, degree: e.target.value });
                if (errors.degree) {
                  setErrors(prev => ({ ...prev, degree: undefined }));
                }
              }}
              className={cn(errors.degree && "border-red-500")}
            />
            {errors.degree && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.degree}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium">Institution</Label>
            <Input
              value={formData.institution}
              onChange={(e) => {
                setFormData({ ...formData, institution: e.target.value });
                if (errors.institution) {
                  setErrors(prev => ({ ...prev, institution: undefined }));
                }
              }}
              className={cn(errors.institution && "border-red-500")}
            />
            {errors.institution && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.institution}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Year</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.year_start && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy") : <span>Select year</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    initialFocus
                    disabled={(date) =>
                      date > new Date() || date < new Date(1900, 0, 1)
                    }
                  />
                </PopoverContent>
              </Popover>
              {errors.year_start && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.year_start}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">End Year</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.year_end && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "yyyy") : <span>Select year</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    initialFocus
                    disabled={(date) =>
                      date > new Date() || date < new Date(1900, 0, 1)
                    }
                  />
                </PopoverContent>
              </Popover>
              {errors.year_end && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.year_end}
                </motion.p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end gap-2 pt-4"
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