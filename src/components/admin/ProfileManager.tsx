import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const ProfileManager = () => {
  return (
    <Card className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Profile Settings</h2>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your Name" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input id="title" placeholder="e.g., Full Stack Developer" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cv">CV Upload</Label>
          <Input id="cv" type="file" accept=".pdf,.doc,.docx" />
        </div>
        
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Card>
  );
};