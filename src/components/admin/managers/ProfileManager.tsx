import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '../profile/ProfileForm';
import { HobbiesManager } from '../profile/HobbiesManager';
import { EducationManager } from '../profile/EducationManager';
import { SocialLinksManager } from '../profile/SocialLinksManager';
import { Tab } from '@/types/dashboard';

interface ProfileManagerProps {
  activeSubTab: string;
  subTabs: Tab[];
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ activeSubTab, subTabs }) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Management</h2>

      <Tabs value={activeSubTab} className="space-y-6">
        <TabsList>
          {subTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center space-x-2"
            >
              <tab.icon className={`h-4 w-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile-main">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="hobbies">
          <HobbiesManager />
        </TabsContent>

        <TabsContent value="education">
          <EducationManager />
        </TabsContent>

        <TabsContent value="social-links">
          <SocialLinksManager />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProfileManager;