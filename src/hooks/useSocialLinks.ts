import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_key: string;
  is_active: boolean;
}

export const useSocialLinks = () => {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      console.log("Fetching social links...");
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_active", true)
        .order("platform");

      if (error) {
        console.error("Error fetching social links:", error);
        throw error;
      }

      console.log("Social links fetched:", data);
      return data as SocialLink[];
    },
  });
};