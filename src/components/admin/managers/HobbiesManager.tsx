import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { HobbiesForm } from "../forms/HobbiesForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const HobbiesManager = () => {
  const { toast } = useToast();
  const [selectedHobby, setSelectedHobby] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: hobbies, refetch } = useQuery({
    queryKey: ["hobbies-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hobbies")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("hobbies").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hobby deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting hobby:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete hobby",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Hobbies & Interests</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedHobby(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Hobby
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedHobby ? "Edit Hobby" : "Add New Hobby"}
              </DialogTitle>
            </DialogHeader>
            <HobbiesForm
              initialData={selectedHobby}
              onClose={() => {
                setIsDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {hobbies?.map((hobby) => (
          <Card key={hobby.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{hobby.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {hobby.category}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedHobby(hobby);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(hobby.id)}
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
