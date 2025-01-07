import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MessageList } from "./MessageList";
import { ProjectManager } from "./ProjectManager";
import { BlogManager } from "./BlogManager";
import { ProfileManager } from "./ProfileManager";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
      return;
    }
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
    navigate("/login");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages">
          <MessageList />
        </TabsContent>
        
        <TabsContent value="projects">
          <ProjectManager />
        </TabsContent>
        
        <TabsContent value="blog">
          <BlogManager />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};