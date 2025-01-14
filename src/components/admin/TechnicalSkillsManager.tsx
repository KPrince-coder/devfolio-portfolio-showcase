import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TechnicalSkillsForm } from "./forms/TechnicalSkillsForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const TechnicalSkillsManager = () => {
  const { toast } = useToast();
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: skills, refetch } = useQuery({
    queryKey: ["technical-skills-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technical_skills")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("technical_skills")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Technical skill deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting technical skill:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete technical skill",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Technical Skills</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedSkill(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <TechnicalSkillsForm
              initialData={selectedSkill}
              onClose={() => {
                setIsDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {skills?.map((skill) => (
          <Card key={skill.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{skill.category}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skill.skills.map((item: string) => (
                    <span
                      key={item}
                      className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedSkill(skill);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(skill.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};