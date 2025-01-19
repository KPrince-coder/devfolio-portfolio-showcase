import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TechnicalSkill {
  name: string;
  proficiency: number;
  category: string;
}

interface TechnicalSkillsFormProps {
  initialSkills?: TechnicalSkill[];
  onSave?: (skills: TechnicalSkill[]) => Promise<void>;
  className?: string;
  isLoading?: boolean;
}

const skillCategories = [
  "Programming Languages",
  "Frameworks",
  "Databases",
  "Cloud Services",
  "Tools",
  "Other",
];

export const TechnicalSkillsForm = ({
  initialSkills = [],
  onSave,
  className,
  isLoading = false,
}: TechnicalSkillsFormProps) => {
  const [skills, setSkills] = useState<TechnicalSkill[]>(initialSkills);
  const [newSkill, setNewSkill] = useState<TechnicalSkill>({
    name: "",
    proficiency: 50,
    category: skillCategories[0],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill name",
        variant: "destructive",
      });
      return;
    }

    if (skills.some((skill) => skill.name.toLowerCase() === newSkill.name.toLowerCase())) {
      toast({
        title: "Error",
        description: "This skill already exists",
        variant: "destructive",
      });
      return;
    }

    setSkills([...skills, newSkill]);
    setNewSkill({
      name: "",
      proficiency: 50,
      category: newSkill.category,
    });
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(skills);
      toast({
        title: "Success",
        description: "Technical skills saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save technical skills",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const filteredSkills = selectedCategory
    ? skills.filter((skill) => skill.category === selectedCategory)
    : skills;

  return (
    <Card className={cn("p-6", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold"
          >
            Technical Skills
          </motion.h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save all technical skills</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {skillCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="skillName">New Skill</Label>
                <Input
                  id="skillName"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                  placeholder="Enter skill name..."
                />
              </div>
              <div className="w-48">
                <Label htmlFor="skillCategory">Category</Label>
                <select
                  id="skillCategory"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={newSkill.category}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, category: e.target.value })
                  }
                >
                  {skillCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Proficiency: {newSkill.proficiency}%</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Slider
                    value={[newSkill.proficiency]}
                    onValueChange={(value) =>
                      setNewSkill({ ...newSkill, proficiency: value[0] })
                    }
                    max={100}
                    step={1}
                  />
                </div>
                <Button onClick={handleAddSkill} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 group">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {skill.category}
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveSkill(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove skill</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-primary-foreground">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </div>
                      <motion.div
                        className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredSkills.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              No skills found. Add your first skill above!
            </motion.div>
          )}
        </div>
      </motion.div>
    </Card>
  );
};