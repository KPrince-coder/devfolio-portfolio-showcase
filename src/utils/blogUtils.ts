import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const checkAuth = async () => {
  console.log("Checking authentication status...");
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Session check error:", sessionError);
    return false;
  }
  
  if (!session) {
    console.log("No active session found");
    return false;
  }

  console.log("Checking admin status for user:", session.user.id);
  
  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', session.user.id)
    .maybeSingle();
  
  if (adminError || !adminData) {
    console.error("Admin check error:", adminError);
    return false;
  }
  
  console.log("Authentication check passed - user is admin");
  return true;
};

export const handleFileUpload = async (file: File) => {
  if (!file) return null;

  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return null;

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `blog_${crypto.randomUUID()}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profile")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage
      .from("profile")
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to upload file",
    });
    return null;
  }
};