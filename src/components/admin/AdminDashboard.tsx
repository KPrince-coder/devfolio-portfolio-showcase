import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageList } from "./MessageList";
import { ProjectManager } from "./ProjectManager";
import { BlogManager } from "./BlogManager";
import { ProfileManager } from "./ProfileManager";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      
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