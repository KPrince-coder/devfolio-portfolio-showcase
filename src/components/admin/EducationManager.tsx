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
import { EducationForm } from "./forms/EducationForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const EducationManager = () => {
  const { toast } = useToast();
  const [selectedEducation, setSelectedEducation] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: education, refetch } = useQuery({
    queryKey: ["education-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("year_start", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supa base
        .from("education")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Education entry deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting education entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete education entry",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Education & Certifications</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedEducation(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <EducationForm
              initialData={selectedEducation}
              onClose={() => {
                setIsDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {education?.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{entry.degree}</h3>
                <p className="text-sm text-muted-foreground">{entry.institution}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {entry.year_start} - {entry.year_end || "Present"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedEducation(entry);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(entry.id)}
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