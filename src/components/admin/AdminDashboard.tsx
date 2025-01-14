import { SocialLinksManager } from "./SocialLinksManager";
import { HobbiesManager } from "./HobbiesManager";
import { EducationManager } from "./EducationManager";

export const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <HobbiesManager />
        <EducationManager />
        <SocialLinksManager />
      </div>
    </div>
  );
};
