import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '../forms/ProfileForm';
import { HobbiesManager } from './HobbiesManager';
import { EducationManager } from './EducationManager';
import { SocialLinksManager } from './SocialLinksManager';
import { Tab } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';

interface ProfileManagerProps {
  activeSubTab: string;
  subTabs: Tab[];
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ activeSubTab, subTabs }) => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    // Update the URL to reflect the selected tab
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('tab', value);
    navigate({ search: searchParams.toString() });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Management</h2>

      <Tabs value={activeSubTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-4">
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