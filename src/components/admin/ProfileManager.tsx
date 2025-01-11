import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ProfileManager = () => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    about_text: "",
    resume_url: "",
    profile_image_url: "",
  });
  const { toast } = useToast();

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      const { data, error } = await supabase
        .from("profile_data")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching profile data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
        return;
      }

      if (data) {
        setProfileData(data);
      }
    };

    fetchProfileData();

    // Set up real-time subscription
    const channel = supabase
      .channel("profile_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profile_data",
        },
        (payload) => {
          console.log("Profile data changed:", payload);
          if (payload.new) {
            setProfileData(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: "resume" | "profile_image"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("profile")
        .getPublicUrl(filePath);

      // Update profile data
      const updateField =
        fileType === "resume" ? "resume_url" : "profile_image_url";
      const { error: updateError } = await supabase
        .from("profile_data")
        .upsert({
          id: profileData.id || undefined,
          [updateField]: publicUrl.publicUrl,
        });

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("profile_data").upsert({
        id: profileData.id || undefined,
        about_text: profileData.about_text,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Profile Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="about">About Text</Label>
          <Textarea
            id="about"
            placeholder="Tell us about yourself"
            value={profileData.about_text || ""}
            onChange={(e) =>
              setProfileData({ ...profileData, about_text: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv">CV Upload</Label>
          <Input
            id="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileUpload(e, "resume")}
            disabled={loading}
          />
          {profileData.resume_url && (
            <p className="text-sm text-muted-foreground">
              Current CV:{" "}
              <a
                href={profileData.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View
              </a>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile_image">Profile Image</Label>
          <Input
            id="profile_image"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "profile_image")}
            disabled={loading}
          />
          {profileData.profile_image_url && (
            <div className="mt-2">
              <img
                src={profileData.profile_image_url}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
};