import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab } from "@/types/dashboard";
import { cn } from "@/lib/utils";

// Import all profile-related components
import { ProfileForm } from "../forms/ProfileForm";
import { HobbiesManager } from "./HobbiesManager";
import { EducationManager } from "./EducationManager";
import { SocialLinksManager } from "./SocialLinksManager";

interface ProfileManagerProps {
  activeSubTab: string | null;

  subTabs: Tab[];

  onSubTabChange: (subTab: string) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  activeSubTab = "profile-main",
  subTabs,
}) => {
  // Define content map for each subtab
  const contentMap: { [key: string]: React.ReactNode } = {
    "profile-main": <ProfileForm />,
    hobbies: <HobbiesManager />,
    education: <EducationManager />,
    "social-links": <SocialLinksManager />,
  };

  return (
    <Card className="p-6 bg-background/60 backdrop-blur border-border/50">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Profile Management
      </h2>

      <Tabs defaultValue={activeSubTab || "profile-main"} className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-4 bg-background/95">
          {subTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex items-center space-x-2 w-full",
                "text-foreground/70 hover:text-foreground",
                "data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
              )}
            >
              <tab.icon className={cn("h-4 w-4", tab.color)} />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {subTabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-6 space-y-6"
          >
            {contentMap[tab.value]}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default ProfileManager;
