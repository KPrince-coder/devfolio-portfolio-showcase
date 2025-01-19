import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, Image, Loader2, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileData {
  id?: string;
  about_text: string | null;
  resume_url: string | null;
  profile_image_url: string | null;
  updated_at?: string | null;
}

interface FileUploadState {
  progress: number;
  error: string | null;
}

export const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [uploadState, setUploadState] = useState<
    Record<string, FileUploadState>
  >({});
  const [profileData, setProfileData] = useState<ProfileData>({
    about_text: "",
    resume_url: "",
    profile_image_url: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // First, check if there are any existing profiles
        const { data: existingProfiles, error: fetchError } = await supabase
          .from("profile_data")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;

        if (!existingProfiles || existingProfiles.length === 0) {
          // If no profile exists, create a new one
          const { data: newProfile, error: createError } = await supabase
            .from("profile_data")
            .insert([
              {
                about_text: "",
                resume_url: "",
                profile_image_url: "",
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          setProfileData(newProfile);
        } else {
          // Use the most recent profile
          setProfileData(existingProfiles[0]);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      }
    };

    fetchProfileData();

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
          if (payload.new) {
            setProfileData(payload.new as ProfileData);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const validateFile = (
    file: File,
    type: "resume" | "profile_image"
  ): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    if (type === "resume") {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        return "Only PDF and Word documents are allowed";
      }
    } else {
      if (!file.type.startsWith("image/")) {
        return "Only image files are allowed";
      }
    }

    return null;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: "resume" | "profile_image"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file, fileType);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: validationError,
      });
      return;
    }

    // Create preview for images
    if (fileType === "profile_image") {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    setUploadState((prev) => ({
      ...prev,
      [fileType]: { progress: 0, error: null },
    }));

    try {
      const fileExt = file.name.split(".").pop();
      const fileName =
        fileType === "resume"
          ? `cv_${new Date().toISOString()}.${fileExt}`
          : `profile_${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      // Upload file with progress tracking
      const controller = new AbortController();
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        const percentage = (event.loaded / event.total) * 100;
        setUploadState((prev) => ({
          ...prev,
          [fileType]: { ...prev[fileType], progress: percentage },
        }));
      };

      const { error: uploadError } = await supabase.storage
        .from("profile")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("profile")
        .getPublicUrl(filePath);

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

      // Clear preview and progress after successful upload
      if (fileType === "profile_image") {
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadState((prev) => ({
        ...prev,
        [fileType]: { ...prev[fileType], error: "Failed to upload file" },
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      });
    } finally {
      // Clear upload state after a delay
      setTimeout(() => {
        setUploadState((prev) => {
          const newState = { ...prev };
          delete newState[fileType];
          return newState;
        });
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.about_text?.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "About text is required",
      });
      return;
    }

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-2xl font-semibold"
        >
          Profile Settings
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="about">About Text</Label>
            <Textarea
              id="about"
              placeholder="Tell us about yourself"
              value={profileData.about_text || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, about_text: e.target.value })
              }
              className="min-h-[150px]"
              required
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="cv" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              CV Upload
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, "resume")}
                disabled={loading || !!uploadState.resume}
                className="flex-1"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      disabled={loading || !!uploadState.resume}
                      onClick={() => document.getElementById("cv")?.click()}
                    >
                      {uploadState.resume ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {uploadState.resume ? "Uploading..." : "Upload CV"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload your CV (PDF or Word, max 5MB)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <AnimatePresence>
              {profileData.resume_url && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  Current CV:{" "}
                  <a
                    href={profileData.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View
                  </a>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="profile_image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Profile Image
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="profile_image"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "profile_image")}
                disabled={loading || !!uploadState.profile_image}
                className="flex-1"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      disabled={loading || !!uploadState.profile_image}
                      onClick={() =>
                        document.getElementById("profile_image")?.click()
                      }
                    >
                      {uploadState.profile_image ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {uploadState.profile_image
                        ? "Uploading..."
                        : "Upload Image"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload your profile image (max 5MB)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <AnimatePresence>
              {(previewImage || profileData.profile_image_url) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-4 relative"
                >
                  <img
                    src={previewImage || profileData.profile_image_url || ""}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full ring-2 ring-primary-teal/20"
                  />
                  {uploadState.profile_image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <div className="text-white text-sm">
                        {Math.round(uploadState.profile_image.progress)}%
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              disabled={
                loading || !!uploadState.resume || !!uploadState.profile_image
              }
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
};
