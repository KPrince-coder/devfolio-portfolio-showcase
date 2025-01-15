import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Link } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SocialLinksForm } from "../forms/SocialLinksForm";

export const SocialLinksManager = () => {
  const { toast } = useToast();
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: socialLinks, refetch } = useQuery({
    queryKey: ["social-links-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("platform", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social link deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete social link",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Social Links</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedLink(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <SocialLinksForm
              initialData={selectedLink}
              onClose={() => {
                setIsDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {socialLinks?.map((link) => (
          <Card key={link.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{link.platform}</h3>
                <p className="text-sm text-muted-foreground">{link.url}</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    link.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {link.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedLink(link);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(link.id)}
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