
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { X, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker"; // Assuming you're using react-datepicker
import "react-datepicker/dist/react-datepicker.css";

// Type Definitions
interface Experience {
  id?: string;
  year: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  achievements: string[];
  icon_key: string;
  color: string;
}

interface ExperienceFormProps {
  initialData?: Experience;
  onClose: () => void;
}

// Validation Function
const validateExperienceForm = (formData: Experience): string[] => {
  const errors: string[] = [];

  if (!formData.year.trim()) {
    errors.push("Year is required");
  }

  if (!formData.title.trim()) {
    errors.push("Job Title is required");
  }

  if (!formData.company.trim()) {
    errors.push("Company name is required");
  }

  if (!formData.description.trim()) {
    errors.push("Job description is required");
  }

  if (formData.technologies.some(tech => !tech.trim())) {
    errors.push("Remove empty technologies or fill them");
  }

  if (formData.achievements.some(achievement => !achievement.trim())) {
    errors.push("Remove empty achievements or fill them");
  }

  return errors;
};

// Main Experience Form Component
export const ExperienceForm = ({ initialData, onClose }: ExperienceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Experience>({
    year: '',
    title: '',
    company: '',
    description: '',
    technologies: [''],
    achievements: [''],
    icon_key: 'code',
    color: 'bg-blue-600'
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        technologies: initialData.technologies?.length ? initialData.technologies : [''],
        achievements: initialData.achievements?.length ? initialData.achievements : ['']
      });
    }
  }, [initialData]);

  // Dynamic Array Field Handlers
  const handleArrayFieldChange = (
    field: 'technologies' | 'achievements', 
    index: number, 
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: 'technologies' | 'achievements') => {
    setFormData({ 
      ...formData, 
      [field]: [...formData[field], ''] 
    });
  };

  const removeArrayField = (field: 'technologies' | 'achievements', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

    // Handle Enter Key for Technologies and Achievements
    const handleKeyDown = (
      field: 'technologies' | 'achievements',
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission
        const value = e.currentTarget.value.trim();
  
        if (value) {
          handleArrayFieldChange(field, index, value);
          if (index === formData[field].length - 1) {
            addArrayField(field); // Add a new field if it's the last one
          }
        }
      }
    };
  
    // Form Submission Handler
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrors([]);
  
      // Validate Form
      const validationErrors = validateExperienceForm(formData);
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }
  
      try {
        const { data, error } = initialData
          ? await supabase
              .from('experiences')
              .update(formData)
              .eq('id', initialData.id)
          : await supabase
              .from('experiences')
              .insert([formData]);
  
        if (error) throw error;
  
        toast({
          title: initialData ? "Experience Updated" : "Experience Added",
          description: `Your professional experience has been successfully ${initialData ? 'updated' : 'added'}.`,
          variant: "default"
        });
  
        onClose();
      } catch (error) {
        console.error('Error saving experience:', error);
        toast({
          title: "Error",
          description: "Failed to save experience. Please try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
    };
  
    // Render Form
    return (
      <div className="relative max-h-[80vh] overflow-y-auto">
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4 flex items-start"
            >
              <AlertCircle className="mr-2 mt-1 text-red-500" />
              <div>
                <h4 className="font-bold mb-2">Form Validation Errors</h4>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm">Year</label>
              <DatePicker
                selected={formData.year ? new Date(formData.year) : null}
                onChange={(date: Date) => setFormData({ ...formData, year: date.getFullYear().toString() })}
                showYearPicker
                dateFormat="yyyy"
                placeholderText="Select Year"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Title</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Job Title"
                required
              />
            </div>
          </div>
  
          <div>
            <label className="block mb-2 text-sm">Company</label>
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Company Name"
              required
            />
          </div>
  
          <div>
            <label className="block mb-2 text-sm">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your role"
              rows={4}
              required          />
              </div>
      
              <div>
                <label className="block mb-2 text-sm">Technologies</label>
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayFieldChange('technologies', index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown('technologies', index, e)}
                      placeholder={`Technology ${index + 1}`}
                    />
                    {index === formData.technologies.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addArrayField('technologies')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    {formData.technologies.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeArrayField('technologies', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
      
              <div>
                <label className="block mb-2 text-sm">Achievements</label>
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleArrayFieldChange('achievements', index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown('achievements', index, e)}
                      placeholder={`Achievement ${index + 1}`}
                    />
                    {index === formData.achievements.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addArrayField('achievements')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    {formData.achievements.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeArrayField('achievements', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
      
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm">Icon</label>
                  <Select 
                    value={formData.icon_key}
                    onValueChange={(value) => setFormData({ ...formData, icon_key: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="code">Code</SelectItem>
                      <SelectItem value="rocket">Rocket</SelectItem>
                      <SelectItem value="palette">Palette</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
      
                <div>
                  <label className="block mb-2 text-sm">Color</label>
                  <Select 
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-blue-600">Blue</SelectItem>
                      <SelectItem value="bg-green-600">Green</SelectItem>
                      <SelectItem value="bg-purple-600">Purple</SelectItem>
                      <SelectItem value="bg-red-600">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
      
              <div className="flex justify-end space-x-4 mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (initialData ? 'Updating...' : 'Adding...') 
                    : (initialData ? 'Update Experience' : 'Add Experience')
                  }
                </Button>
              </div>
            </form>
          </div>
        );
      };
      
  