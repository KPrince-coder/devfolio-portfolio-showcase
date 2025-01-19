import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";
import { motion, AnimatePresence } from "framer-motion";

export const TimelineManager = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      console.error("Error fetching experiences:", error);
      return;
    }

    setExperiences(data || []);
  };

  const handleDeleteExperience = async (id: string) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id);

    if (error) {
      console.error("Error deleting experience:", error);
      return;
    }

    fetchExperiences();
  };

  const handleEditExperience = (experience: any) => {
    setEditingExperience(experience);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingExperience?.id) {
        // Update existing experience
        const { error } = await supabase
          .from("experiences")
          .update(data)
          .eq("id", editingExperience.id);

        if (error) throw error;
      } else {
        // Create new experience
        const { error } = await supabase.from("experiences").insert([data]);

        if (error) throw error;
      }

      setIsDialogOpen(false);
      setEditingExperience(null);
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const handleDelete = async () => {
    if (!editingExperience?.id) return;

    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", editingExperience.id);

      if (error) throw error;

      setIsDialogOpen(false);
      setEditingExperience(null);
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Professional Timeline</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExperience(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
            </DialogHeader>
            <ExperienceForm
              initialData={editingExperience}
              onSubmit={handleSubmit}
              onDelete={editingExperience ? handleDelete : undefined}
              onCancel={() => setIsDialogOpen(false)}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingExperience(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {experiences.map((exp) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center mb-4 shadow-sm"
          >
            <div>
              <h3 className="font-bold text-lg">
                {exp.title} at {exp.company}
              </h3>
              <p className="text-sm text-gray-500">{exp.year}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditExperience(exp)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteExperience(exp.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
