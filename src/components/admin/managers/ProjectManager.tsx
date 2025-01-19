import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Save,
  Loader2,
  Link,
  Github,
  ExternalLink,
  Image as ImageIcon,
  GripVertical,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { ProjectSkeletonList } from "../skeletons/ProjectSkeleton";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  technologies: string[];
  order: number;
}

interface ProjectManagerProps {
  className?: string;
}

export const ProjectManager = ({ className }: ProjectManagerProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newTechnology, setNewTechnology] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order");

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "No Projects Found",
          description: "Start by adding your first project!",
          variant: "default",
        });
        setProjects([]);
      } else {
        const mappedProjects = (data || []).map((item, index) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          demo_url: item.demo_link,
          github_url: item.github_link,
          technologies: item.tags,
          order: index,
        }));
        setProjects(mappedProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split(".").pop();
    const filePath = `projects/${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("public").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: [],
      order: projects.length,
    };
    setEditingProject(newProject);
  };

  const handleSaveProject = async () => {
    if (!editingProject) return;

    setIsSaving(true);
    try {
      let imageUrl = editingProject.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const projectData = {
        id: editingProject.id,
        title: editingProject.title,
        description: editingProject.description,
        image_url: imageUrl,
        demo_link: editingProject.demo_url,
        github_link: editingProject.github_url,
        tags: editingProject.technologies,
        category: "default",
        order: editingProject.order,
      };

      const { error } = editingProject.id.includes("temp")
        ? await supabase.from("projects").insert([projectData])
        : await supabase
            .from("projects")
            .update(projectData)
            .eq("id", editingProject.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project saved successfully",
      });

      fetchProjects();
      setEditingProject(null);
      setImageFile(null);
      setPreviewUrl("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      fetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleAddTechnology = () => {
    if (!editingProject || !newTechnology.trim()) return;

    if (editingProject.technologies.includes(newTechnology.trim())) {
      toast({
        title: "Error",
        description: "This technology is already added",
        variant: "destructive",
      });
      return;
    }

    setEditingProject({
      ...editingProject,
      technologies: [...editingProject.technologies, newTechnology.trim()],
    });
    setNewTechnology("");
  };

  const handleRemoveTechnology = (tech: string) => {
    if (!editingProject) return;

    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter((t) => t !== tech),
    });
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedProjects = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setProjects(updatedProjects);

    try {
      const { error } = await supabase.from("projects").upsert(
        updatedProjects.map(({ id, order, title }) => ({
          id,
          order,
          title,
          category: "default",
        }))
      );

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project order",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("p-6", className)}>
        <ProjectSkeletonList />
      </Card>
    );
  }

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
            Projects
          </motion.h3>
          <Button onClick={handleAddProject} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {editingProject ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: e.target.value,
                    })
                  }
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
            </div>

            <div className="space-y-2">
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
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  value={editingProject.demo_url || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      demo_url: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-2">
                {editingProject.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tech}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTechnology(tech)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add technology..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTechnology();
                    }
                  }}
                />
                <Button onClick={handleAddTechnology} size="sm">
                  Add
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingProject(null);
                  setImageFile(null);
                  setPreviewUrl("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProject} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Project
              </Button>
            </div>
          </motion.div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="projects">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  <AnimatePresence mode="popLayout">
                    {projects.map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                      >
                        {(provided) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card className="p-4">
                              <div className="flex items-start gap-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-2 text-muted-foreground cursor-move"
                                >
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                {project.image_url && (
                                  <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="h-24 w-24 object-cover rounded-lg"
                                  />
                                )}
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium">
                                        {project.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {project.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {project.demo_url && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                  window.open(
                                                    project.demo_url,
                                                    "_blank"
                                                  )
                                                }
                                              >
                                                <ExternalLink className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>View Demo</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                      {project.github_url && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                  window.open(
                                                    project.github_url,
                                                    "_blank"
                                                  )
                                                }
                                              >
                                                <Github className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>View Source</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8"
                                              onClick={() =>
                                                setEditingProject(project)
                                              }
                                            >
                                              <Link className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Edit Project</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 text-red-500 hover:text-red-600"
                                              onClick={() =>
                                                handleDeleteProject(project.id)
                                              }
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Delete Project</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                      <Badge
                                        key={tech}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </motion.div>
    </Card>
  );
};
