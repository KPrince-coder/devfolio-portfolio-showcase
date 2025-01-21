import React, { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  technologies: string[];
  category: "Data Engineering" | "Web Development" | "Android Development";
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ProjectFormProps {
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
  open: boolean;
}

export function ProjectForm({
  project,
  onClose,
  onSave,
  open,
}: ProjectFormProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(project);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [newTechnology, setNewTechnology] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditingProject(project);
    setImageFile(null);
    setPreviewUrl("");
  }, [project]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTechnology = () => {
    if (!editingProject) return;

    const tech = newTechnology.trim();
    if (tech && !editingProject.technologies.includes(tech)) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, tech],
      });
      setNewTechnology("");
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    if (!editingProject) return;

    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter(
        (tech) => tech !== techToRemove
      ),
    });
  };

  const handleSaveProject = async () => {
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      toast({
        title: "Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return;
    }

    if (!editingProject.description.trim()) {
      toast({
        title: "Error",
        description: "Project description is required",
        variant: "destructive",
      });
      return;
    }

    if (!editingProject.category) {
      toast({
        title: "Error",
        description: "Project category is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      let imageUrl = editingProject.image_url;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      if (imageFile) {
        // Delete old image if it exists
        if (imageUrl) {
          const oldImagePath = imageUrl.split('/').pop();
          if (oldImagePath) {
            await supabase.storage
              .from('project-images')
              .remove([`${user.id}/${oldImagePath}`]);
          }
        }

        // Upload new image to user's folder
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(`${user.id}/${Date.now()}-${imageFile.name}`, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from('project-images')
          .getPublicUrl(uploadData?.path || "");

        imageUrl = publicUrl;
      }

      const projectData = {
        title: editingProject.title.trim(),
        description: editingProject.description.trim(),
        image_url: imageUrl,
        live_url: editingProject.live_url,
        github_url: editingProject.github_url,
        technologies: editingProject.technologies,
        category: editingProject.category,
        user_id: user.id,
      };

      const { error } = editingProject.id.includes("temp")
        ? await supabase.from("projects").insert(projectData)
        : await supabase
            .from("projects")
            .update(projectData)
            .eq("id", editingProject.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project saved successfully!",
        variant: "default",
      });

      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!editingProject) return null;

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] flex flex-col gap-0 p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {editingProject.id.includes("temp") ? "Add Project" : "Edit Project"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details below to{" "}
            {editingProject.id.includes("temp") ? "create a new" : "update the"}{" "}
            project.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editingProject.title}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    description: e.target.value,
                  })
                }
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editingProject.category}
                onValueChange={(value) =>
                  setEditingProject({
                    ...editingProject,
                    category: value as Project["category"],
                  })
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="Data Engineering"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    Data Engineering
                  </SelectItem>
                  <SelectItem
                    value="Web Development"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    Web Development
                  </SelectItem>
                  <SelectItem
                    value="Android Development"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    Android Development
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input
                id="demoUrl"
                value={editingProject.live_url || ""}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, live_url: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={editingProject.github_url || ""}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    github_url: e.target.value,
                  })
                }
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectImage">Project Image</Label>
              <div className="flex items-center gap-4">
                {(previewUrl || editingProject.image_url) && (
                  <img
                    src={previewUrl || editingProject.image_url}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                )}
                <label className="cursor-pointer">
                  <Input
                    id="projectImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ImageIcon className="h-4 w-4" />
                    Choose Image
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies</Label>
              <div className="flex gap-2">
                <Input
                  id="technologies"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTechnology();
                    }
                  }}
                  placeholder="Add technology and press Enter"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTechnology}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editingProject.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {tech}
                    <button
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:mr-2 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSaveProject}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
