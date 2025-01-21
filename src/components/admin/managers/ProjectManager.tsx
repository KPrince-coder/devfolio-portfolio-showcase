import React, { useEffect, useState, useMemo } from "react";
import { ImageIcon, Loader2, Plus, Search, Tag, Edit, Trash, Filter, SortAsc, SortDesc, Link, Github, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectSkeletonList } from "../skeletons/ProjectSkeleton";
import { ProjectForm, Project } from "@/components/admin/forms/ProjectForm";

interface ProjectManagerProps {
  className?: string;
}

type SortField = "title" | "created_at" | "category";
type SortOrder = "asc" | "desc";

export const ProjectManager = ({ className }: ProjectManagerProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all");
  const [selectedTech, setSelectedTech] = useState<string | null>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  // Get unique technologies from all projects
  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((project) => {
      project.technologies?.forEach((tech) => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, [projects]);

  const categories = ["Web Development", "Data Engineering", "Android Development"];

  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch =
          search === "" ||
          project.title.toLowerCase().includes(search.toLowerCase()) ||
          project.description.toLowerCase().includes(search.toLowerCase()) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(search.toLowerCase())
          );

        const matchesCategory =
          selectedCategory === "all" || project.category === selectedCategory;

        const matchesTech =
          selectedTech === "all" ||
          project.technologies.some((tech) => tech === selectedTech);

        return matchesSearch && matchesCategory && matchesTech;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "category":
            comparison = a.category.localeCompare(b.category);
            break;
          case "created_at":
            comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            break;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [projects, search, selectedCategory, selectedTech, sortField, sortOrder]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "No Projects Found",
          description: "Start by adding your first project!",
          variant: "default",
        });
        setProjects([]);
      } else {
        const mappedProjects = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          live_url: item.live_url,
          github_url: item.github_url,
          technologies: item.technologies || [],
          category: item.category,
          created_at: item.created_at,
          updated_at: item.updated_at,
          user_id: item.user_id
        }));
        setProjects(mappedProjects);
      }
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    const newProject: Project = {
      id: `temp-${Date.now()}`,
      title: "",
      description: "",
      technologies: [],
      category: "Web Development",
      user_id: ""
    };
    setEditingProject(newProject);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
        variant: "default",
      });

      fetchProjects();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <ProjectSkeletonList />;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            {filteredAndSortedProjects.length} project{filteredAndSortedProjects.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button onClick={handleAddProject}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTech} onValueChange={setSelectedTech}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            {allTechnologies.map((tech) => (
              <SelectItem key={tech} value={tech}>
                {tech}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="created_at">Date</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <ProjectForm
        project={editingProject}
        open={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSave={fetchProjects}
      />

      <AnimatePresence>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group relative overflow-hidden hover:shadow-md transition-all duration-200">
                {project.image_url && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium line-clamp-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.live_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(project.live_url, '_blank')}
                          title="View live demo"
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      )}
                      {project.github_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(project.github_url, '_blank')}
                          title="View source code"
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(project.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        project.category === "Data Engineering" &&
                          "bg-blue-100 text-blue-800",
                        project.category === "Web Development" &&
                          "bg-green-100 text-green-800",
                        project.category === "Android Development" &&
                          "bg-purple-100 text-purple-800"
                      )}
                    >
                      {project.category}
                    </Badge>
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                  {(project.created_at || project.updated_at) && (
                    <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
                      {project.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Created: {new Date(project.created_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {project.updated_at && project.updated_at !== project.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Modified: {new Date(project.updated_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteConfirm && handleDeleteProject(deleteConfirm)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
