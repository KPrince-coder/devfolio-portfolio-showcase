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
import { TechnicalProficiencyForm } from "../forms/TechnicalProficiencyForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

export const TechnicalProficiencyManager = () => {
  const { toast } = useToast();
  const [selectedProficiency, setSelectedProficiency] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: proficiencies, refetch } = useQuery({
    queryKey: ["technical-proficiency-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technical_proficiency")
        .select("*")
        .order("proficiency", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("technical_proficiency")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Technical proficiency deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting technical proficiency:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete technical proficiency",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Technical Proficiency</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedProficiency(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Proficiency
            </Button>
          </DialogTrigger>
          <DialogContent>
            <TechnicalProficiencyForm
              initialData={selectedProficiency}
              onClose={() => {
                setIsDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {proficiencies?.map((proficiency) => (
          <Card key={proficiency.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{proficiency.skill}</h3>
                  <span className="text-sm text-muted-foreground">
                    {proficiency.proficiency}%
                  </span>
                </div>
                <Progress value={proficiency.proficiency} className="h-2" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedProficiency(proficiency);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(proficiency.id)}
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