import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ProjectManager = () => {
  // In production, projects would be fetched from Supabase
  const projects: any[] = [];

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="p-4">
              <h3 className="mb-2 font-medium">{project.title}</h3>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          No projects yet
        </div>
      )}
    </Card>
  );
};